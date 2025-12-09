// Website Crawler Edge Function
// Crawls business website to extract content for AI analysis

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, userId } = await req.json();

    if (!url || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL
    let websiteUrl: URL;
    try {
      websiteUrl = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Crawling website:', websiteUrl.toString());

    // Fetch the website HTML
    const response = await fetch(websiteUrl.toString(), {
      headers: {
        'User-Agent': 'Silent-Pilot-Bot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();

    // Extract useful content
    const content = extractContent(html);

    // Use AI to analyze the content
    const analysis = await analyzeWithAI(content, websiteUrl.hostname);

    // Store the crawl results in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('website_crawls').insert({
      user_id: userId,
      url: websiteUrl.toString(),
      content_extracted: content,
      ai_analysis: analysis,
      crawled_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        contentIdeas: analysis.post_ideas || []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Website crawler error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function extractContent(html: string) {
  // Remove scripts and styles
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Extract title
  const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // Extract meta description
  const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';
  
  // Extract headings
  const h1Matches = text.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
  const h2Matches = text.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
  
  const headings = [...h1Matches, ...h2Matches]
    .map(h => h.replace(/<[^>]+>/g, '').trim())
    .filter(h => h.length > 0);
  
  // Extract paragraphs
  const pMatches = text.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
  const paragraphs = pMatches
    .map(p => p.replace(/<[^>]+>/g, '').trim())
    .filter(p => p.length > 50); // Only substantial paragraphs
  
  return {
    title,
    description,
    headings: headings.slice(0, 10), // Top 10 headings
    paragraphs: paragraphs.slice(0, 5), // Top 5 paragraphs
    fullText: text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 5000)
  };
}

async function analyzeWithAI(content: any, domain: string) {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiKey) {
    console.warn('OpenAI API key not set, returning basic analysis');
    return {
      summary: 'Website content extracted successfully',
      topics: content.headings,
      post_ideas: generateBasicIdeas(content),
    };
  }

  try {
    const prompt = `Analyze this website content from ${domain} and provide:
1. A brief summary of what the business does
2. Key topics/themes found
3. 5 social media post ideas based on the content

Website Title: ${content.title}
Description: ${content.description}
Key Headings: ${content.headings.join(', ')}
Content Preview: ${content.fullText.substring(0, 1000)}

Return response as JSON with: summary, topics (array), post_ideas (array of objects with 'title' and 'content')`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media marketing expert analyzing website content.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to text
    try {
      return JSON.parse(aiResponse);
    } catch {
      return {
        summary: aiResponse,
        topics: content.headings,
        post_ideas: generateBasicIdeas(content),
      };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      summary: 'AI analysis unavailable, basic analysis provided',
      topics: content.headings,
      post_ideas: generateBasicIdeas(content),
    };
  }
}

function generateBasicIdeas(content: any) {
  const ideas = [];
  
  if (content.title) {
    ideas.push({
      title: 'Company Introduction',
      content: `Excited to share more about ${content.title}! ${content.description || 'Check out our website for more information.'}`
    });
  }
  
  content.headings.slice(0, 4).forEach((heading: string, idx: number) => {
    ideas.push({
      title: heading,
      content: `📢 ${heading}\n\nLearn more about this and other offerings on our website!`
    });
  });
  
  return ideas.slice(0, 5);
}
