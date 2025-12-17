// Supabase Edge Function to discover social media presence
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessName, website } = await req.json();

    if (!businessName) {
      return new Response(
        JSON.stringify({ error: 'Business name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Discovering social media for:', businessName);

    const socialMedia: any = {
      linkedin: null,
      twitter: null,
      facebook: null,
      instagram: null,
      youtube: null,
      tiktok: null,
    };

    // Clean business name for URL searches
    const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const variations = [
      cleanName,
      businessName.toLowerCase().replace(/\s+/g, ''),
      businessName.toLowerCase().replace(/\s+/g, '-'),
    ];

    // Check each variation
    for (const variation of variations) {
      // LinkedIn
      if (!socialMedia.linkedin) {
        const linkedinUrls = [
          `https://linkedin.com/company/${variation}`,
          `https://www.linkedin.com/company/${variation}`,
        ];
        for (const url of linkedinUrls) {
          if (await checkUrlExists(url)) {
            socialMedia.linkedin = url;
            break;
          }
        }
      }

      // Twitter/X
      if (!socialMedia.twitter) {
        const twitterUrls = [
          `https://twitter.com/${variation}`,
          `https://x.com/${variation}`,
        ];
        for (const url of twitterUrls) {
          if (await checkUrlExists(url)) {
            socialMedia.twitter = url;
            break;
          }
        }
      }

      // Facebook
      if (!socialMedia.facebook) {
        const facebookUrls = [
          `https://facebook.com/${variation}`,
          `https://www.facebook.com/${variation}`,
        ];
        for (const url of facebookUrls) {
          if (await checkUrlExists(url)) {
            socialMedia.facebook = url;
            break;
          }
        }
      }

      // Instagram
      if (!socialMedia.instagram) {
        const instagramUrls = [
          `https://instagram.com/${variation}`,
          `https://www.instagram.com/${variation}`,
        ];
        for (const url of instagramUrls) {
          if (await checkUrlExists(url)) {
            socialMedia.instagram = url;
            break;
          }
        }
      }

      // YouTube
      if (!socialMedia.youtube) {
        const youtubeUrls = [
          `https://youtube.com/@${variation}`,
          `https://www.youtube.com/@${variation}`,
          `https://youtube.com/c/${variation}`,
        ];
        for (const url of youtubeUrls) {
          if (await checkUrlExists(url)) {
            socialMedia.youtube = url;
            break;
          }
        }
      }
    }

    const result = {
      businessName,
      socialMedia,
      foundCount: Object.values(socialMedia).filter(v => v !== null).length,
      discoveredAt: new Date().toISOString(),
    };

    console.log('Social media discovery complete:', result.foundCount, 'platforms found');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Social media discovery error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to check if URL exists
async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SilentPilot/1.0)',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
