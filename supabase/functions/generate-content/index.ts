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
      ? 'You are an expert email marketing copywriter. Create compelling email campaigns with HTML formatting. Format your response as:\nSubject: [subject line]\nPreview: [preview text]\n\n[HTML email body]'
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
        max_tokens: 1000,
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
