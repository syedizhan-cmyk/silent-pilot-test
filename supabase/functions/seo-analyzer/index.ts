// SEO Analyzer Edge Function
// Fetches and analyzes websites server-side to avoid CORS issues

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
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

    console.log('Analyzing website:', websiteUrl.toString());

    // Fetch the website
    const startTime = performance.now();
    const response = await fetch(websiteUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SilentPilot-SEO-Bot/1.0)',
      },
    });
    const loadTime = performance.now() - startTime;

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    const contentLength = new Blob([html]).size;

    // Perform SEO Analysis
    const analysis = {
      audit: performSEOAudit(html, url),
      keywords: extractKeywords(html),
      speed: {
        loadTime: Math.round(loadTime),
        score: loadTime < 1000 ? 95 : loadTime < 3000 ? 75 : 50,
        recommendation: loadTime < 1000 ? 'Excellent!' : loadTime < 3000 ? 'Good' : 'Needs improvement',
        contentSize: Math.round(contentLength / 1024), // KB
      },
    };

    return new Response(
      JSON.stringify({ success: true, ...analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('SEO Analyzer error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function performSEOAudit(html: string, url: string) {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  if (!title) {
    issues.push('❌ Missing page title');
    score -= 10;
  } else if (title.length < 30) {
    issues.push('⚠️ Title too short (< 30 characters)');
    score -= 5;
  } else if (title.length > 60) {
    issues.push('⚠️ Title too long (> 60 characters)');
    score -= 5;
  } else {
    recommendations.push('✅ Title length optimal');
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const description = descMatch ? descMatch[1].trim() : '';
  
  if (!description) {
    issues.push('❌ Missing meta description');
    score -= 10;
  } else if (description.length < 120) {
    issues.push('⚠️ Description too short');
    score -= 5;
  } else if (description.length > 160) {
    issues.push('⚠️ Description too long');
    score -= 5;
  } else {
    recommendations.push('✅ Description optimal');
  }

  // Check H1
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count === 0) {
    issues.push('❌ No H1 heading');
    score -= 10;
  } else if (h1Count > 1) {
    issues.push('⚠️ Multiple H1 headings');
    score -= 5;
  } else {
    recommendations.push('✅ H1 structure correct');
  }

  // Check images
  const imgCount = (html.match(/<img[^>]*>/gi) || []).length;
  const imgWithAlt = (html.match(/<img[^>]*alt=["'][^"']+["'][^>]*>/gi) || []).length;
  if (imgCount > imgWithAlt) {
    issues.push(`⚠️ ${imgCount - imgWithAlt} images missing alt`);
    score -= 5;
  }

  // Check HTTPS
  if (!url.startsWith('https://')) {
    issues.push('⚠️ Not using HTTPS');
    score -= 10;
  } else {
    recommendations.push('✅ Using HTTPS');
  }

  // Check viewport
  const hasViewport = html.includes('viewport');
  if (!hasViewport) {
    issues.push('❌ Not mobile-friendly');
    score -= 10;
  } else {
    recommendations.push('✅ Mobile-friendly');
  }

  // Check page size
  const sizeKB = new Blob([html]).size / 1024;
  if (sizeKB > 500) {
    issues.push(`⚠️ Large page (${sizeKB.toFixed(0)}KB)`);
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    title,
    description,
    issues,
    recommendations,
    stats: {
      imagesTotal: imgCount,
      imagesWithAlt: imgWithAlt,
      pageSizeKB: sizeKB.toFixed(0),
      h1Count,
    }
  };
}

function extractKeywords(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').toLowerCase();
  const words = text.match(/\b[a-z]{4,}\b/g) || [];
  
  const stopWords = ['this', 'that', 'with', 'from', 'have', 'been', 'will', 'your', 'more', 'than', 'them', 'these', 'those', 'into', 'also', 'only'];
  
  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      keyword: word,
      frequency: count,
      density: ((count / words.length) * 100).toFixed(2)
    }));
}
