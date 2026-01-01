// Edge Function: tiktok-auth
// Starts TikTok OAuth by redirecting the user to TikTok's authorization URL
// Requires secrets: TIKTOK_CLIENT_KEY, TIKTOK_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_KEY = Deno.env.get('TIKTOK_CLIENT_KEY');
    const REDIRECT_URI = Deno.env.get('TIKTOK_REDIRECT_URI');

    if (!CLIENT_KEY || !REDIRECT_URI) {
      return new Response('TikTok OAuth not configured', { status: 500 });
    }

    const state = encodeURIComponent(JSON.stringify({ 
      user_id, 
      platform: 'tiktok'
    }));

    // Generate CSRF token
    const csrfState = crypto.randomUUID();

    const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
    authUrl.searchParams.set('client_key', CLIENT_KEY);
    authUrl.searchParams.set('scope', 'user.info.basic,video.upload,video.publish');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('state', state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl.toString() },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
