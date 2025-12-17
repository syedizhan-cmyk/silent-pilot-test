// Supabase Edge Function to scrape and analyze websites
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    console.log('Scraping website:', url);

    // Fetch the website
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SilentPilot/1.0; +https://silentpilot.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Extract metadata
    const getMetaContent = (name: string) => {
      const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return meta?.getAttribute('content') || '';
    };

    const title = doc.querySelector('title')?.textContent || '';
    const description = getMetaContent('description') || getMetaContent('og:description');
    const keywords = getMetaContent('keywords').split(',').map((k: string) => k.trim()).filter(Boolean);

    // Extract main content
    const contentSelectors = ['main', 'article', '.content', '#content', '.main-content', 'body'];
    let mainContent = '';
    
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        mainContent = element.textContent || '';
        if (mainContent.length > 100) break;
      }
    }

    // Clean and truncate content
    const content = mainContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
      .substring(0, 5000);

    // Extract images
    const images: string[] = [];
    doc.querySelectorAll('img').forEach((img: any) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        const absoluteUrl = new URL(src, url).href;
        images.push(absoluteUrl);
      }
    });

    // Extract social links
    const socialLinks: { platform: string; url: string }[] = [];
    const socialDomains = {
      'linkedin.com': 'linkedin',
      'twitter.com': 'twitter',
      'facebook.com': 'facebook',
      'instagram.com': 'instagram',
      'youtube.com': 'youtube',
      'tiktok.com': 'tiktok',
    };

    doc.querySelectorAll('a[href]').forEach((link: any) => {
      const href = link.getAttribute('href');
      if (href) {
        for (const [domain, platform] of Object.entries(socialDomains)) {
          if (href.includes(domain) && !socialLinks.some(s => s.platform === platform)) {
            socialLinks.push({ platform, url: href });
          }
        }
      }
    });

    // Extract services/products
    const services: string[] = [];
    const productKeywords = ['service', 'product', 'solution', 'offering'];
    
    doc.querySelectorAll('h2, h3, .service, .product, [class*="service"], [class*="product"]').forEach((el: any) => {
      const text = el.textContent?.trim();
      if (text && text.length < 100 && text.length > 5) {
        const lowerText = text.toLowerCase();
        if (productKeywords.some(keyword => lowerText.includes(keyword)) || 
            el.className?.includes('service') || 
            el.className?.includes('product')) {
          services.push(text);
        }
      }
    });

    // Extract about section
    let about = '';
    const aboutSelectors = [
      '[id*="about"]', 
      '[class*="about"]', 
      '.about-us', 
      '#about-us',
      '.company-info',
      '.who-we-are'
    ];
    
    for (const selector of aboutSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        about = element.textContent?.trim().substring(0, 1000) || '';
        if (about.length > 50) break;
      }
    }

    // Extract contact info
    const contactInfo: any = {};
    
    // Email
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      contactInfo.email = emailMatch[0];
    }

    // Phone
    const phoneMatch = html.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      contactInfo.phone = phoneMatch[0];
    }

    const result = {
      url,
      title,
      description,
      keywords: keywords.slice(0, 20),
      content,
      images: images.slice(0, 10),
      socialLinks,
      services: [...new Set(services)].slice(0, 10),
      products: [], // Could be enhanced with product-specific scraping
      about,
      contactInfo,
      scrapedAt: new Date().toISOString(),
    };

    console.log('Successfully scraped website:', title);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
