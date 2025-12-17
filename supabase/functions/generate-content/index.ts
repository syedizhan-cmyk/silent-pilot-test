import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, type = 'email' } = await req.json()
    
    if (!prompt) {
      throw new Error('Prompt is required')
    }
    
    const groqKey = Deno.env.get('GROQ_API_KEY')
    
    if (!groqKey) {
      throw new Error('AI API key not configured')
    }

    const systemPrompt = type === 'email' 
      ? `You are an HTML email designer. Your ONLY job is to output HTML code following the EXACT structure shown below.

CRITICAL: Your response MUST start with the HTML template. Do NOT skip the <img> tag.

YOU MUST USE THIS EXACT STRUCTURE - Just replace the content in [brackets]:
<div style="max-width:600px; margin:0 auto; font-family:Arial,sans-serif; background:#ffffff;">
  <img src="https://dummyimage.com/600x300/4A90E2/ffffff&text=[Business+Name]" alt="Hero" style="width:100%; height:auto; display:block; margin:0;">
  <div style="padding:40px 30px; background:#ffffff;">
    <h1 style="color:#2c3e50; margin:0 0 20px 0; font-size:28px; line-height:1.3;">[Personalized Headline]</h1>
    <p style="color:#555; line-height:1.8; font-size:16px; margin:0 0 25px 0;">[Personalized content paragraph]</p>
    <a href="#" style="display:inline-block; padding:14px 35px; background:#007bff; color:#ffffff; text-decoration:none; border-radius:5px; font-weight:bold; font-size:16px;">[Call to Action]</a>
    <p style="color:#888; font-size:14px; margin:25px 0 0 0; line-height:1.6;">[Additional content or value proposition]</p>
  </div>
</div>

PERSONALIZATION RULES:
1. Replace [Business+Name] in the image URL with the actual business name (use + for spaces)
2. Write the headline specifically for their business/industry
3. Reference their actual products/services in the content
4. Make the CTA relevant to the campaign goal
5. Change the image color (4A90E2) to match their industry: Blue=tech/finance, Green=health/eco, Red=food/urgent, Purple=creative

Format your complete response as:
Subject: [subject line]
Preview: [preview text]

[THE COMPLETE HTML CODE ABOVE - DO NOT SKIP THE <img> TAG]`
      : 'You are a social media content expert.'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'AI API error')
    }

    const content = data.choices?.[0]?.message?.content || ''

    return new Response(
      JSON.stringify({ success: true, content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
