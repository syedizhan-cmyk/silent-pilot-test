import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { campaignId, eventType, subscriberId } = await req.json()

    // Track engagement event
    await supabaseClient
      .from('email_engagement')
      .insert({
        subscriber_id: subscriberId,
        campaign_id: campaignId,
        event_type: eventType, // 'opened', 'clicked', 'bounced', 'unsubscribed'
        last_engaged: new Date().toISOString(),
      })

    // Update campaign metrics
    const { data: engagement } = await supabaseClient
      .from('email_engagement')
      .select('event_type')
      .eq('campaign_id', campaignId)

    if (engagement) {
      const total = engagement.length
      const opened = engagement.filter(e => e.event_type === 'opened').length
      const clicked = engagement.filter(e => e.event_type === 'clicked').length

      const openRate = total > 0 ? (opened / total) * 100 : 0
      const clickRate = opened > 0 ? (clicked / opened) * 100 : 0

      await supabaseClient
        .from('email_campaigns')
        .update({
          open_rate: openRate.toFixed(2),
          click_rate: clickRate.toFixed(2),
        })
        .eq('id', campaignId)
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
