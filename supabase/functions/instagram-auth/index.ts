// Edge Function: instagram-auth
// Starts Instagram OAuth by redirecting the user to Facebook's authorization URL
// Instagram uses Facebook OAuth with specific scopes
// Requires secrets: FACEBOOK_APP_ID, INSTAGRAM_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_ID = Deno.env.get('FACEBOOK_APP_ID');
    const REDIRECT_URI = Deno.env.get('INSTAGRAM_REDIRECT_URI');

    if (!CLIENT_ID || !REDIRECT_URI) {
      return new Response('Instagram OAuth not configured', { status: 500 });
    }

    const state = encodeURIComponent(JSON.stringify({ 
      user_id, 
      platform: 'instagram'
    }));

    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,business_management');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_type', 'code');

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl.toString() },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
