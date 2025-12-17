import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  campaignId: string;
  recipientEmail?: string;
  testMode?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { campaignId, recipientEmail, testMode = false } = await req.json() as EmailRequest

    // Get the campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('email_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found')
    }

    // Get recipients
    let recipients = []
    
    if (testMode && recipientEmail) {
      // Test mode: send to specific email (don't need database subscribers)
      console.log('📧 Test mode: sending to', recipientEmail)
      recipients = [{ 
        email: recipientEmail, 
        first_name: 'Test', 
        last_name: 'User',
        id: null 
      }]
    } else {
      // Production mode: get all active subscribers from database
      console.log('📧 Production mode: fetching subscribers for user', campaign.user_id)
      const { data: subscribers, error: subscribersError } = await supabaseClient
        .from('email_subscribers')
        .select('id, email, first_name, last_name')
        .eq('user_id', campaign.user_id)
        .eq('status', 'active')

      console.log('📊 Found', subscribers?.length || 0, 'subscribers')

      if (subscribersError) {
        console.error('❌ Subscriber fetch error:', subscribersError)
        throw new Error('Failed to fetch subscribers: ' + subscribersError.message)
      }

      recipients = subscribers || []
    }

    if (recipients.length === 0) {
      throw new Error('No recipients found')
    }

    // Get Resend API key (you'll need to add this as a secret)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    
    if (!resendApiKey) {
      throw new Error('Email service not configured. Please add RESEND_API_KEY secret.')
    }

    // Send emails using Resend API
    const emailPromises = recipients.map(async (recipient) => {
      // Personalize email content (use 'content' field)
      const emailBody = campaign.content || campaign.body || ''
      const personalizedBody = emailBody
        .replace(/\{first_name\}/g, recipient.first_name || 'there')
        .replace(/\{last_name\}/g, recipient.last_name || '')
        .replace(/\{email\}/g, recipient.email)

      const emailPayload = {
        from: Deno.env.get('EMAIL_FROM') || 'noreply@silentpilot.org',
        to: [recipient.email],
        subject: campaign.subject,
        html: personalizedBody,
        reply_to: campaign.reply_to || 'syedizhan@silentpilot.org', // Replies go here
      }

      // Send via Resend
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify(emailPayload),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Failed to send email:', result)
        throw new Error(`Failed to send to ${recipient.email}`)
      }

      // Track engagement
      await supabaseClient
        .from('email_engagement')
        .insert({
          subscriber_id: recipient.id || null,
          campaign_id: campaignId,
          event_type: 'sent',
        })

      return result
    })

    const results = await Promise.allSettled(emailPromises)
    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failureCount = results.filter(r => r.status === 'rejected').length

    // Update campaign status and metrics
    const updates: any = {
      status: testMode ? campaign.status : 'sent',
    }

    if (!testMode) {
      updates.sent_at = new Date().toISOString()
    }

    await supabaseClient
      .from('email_campaigns')
      .update(updates)
      .eq('id', campaignId)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email campaign ${testMode ? 'test ' : ''}sent successfully`,
        successCount,
        failureCount,
        totalRecipients: recipients.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
