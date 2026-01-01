// Edge Function: facebook-auth
// Starts Facebook OAuth by redirecting the user to Facebook's authorization URL
// Requires secrets: FACEBOOK_APP_ID, FACEBOOK_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_ID = Deno.env.get('FACEBOOK_APP_ID');
    const REDIRECT_URI = Deno.env.get('FACEBOOK_REDIRECT_URI');

    if (!CLIENT_ID || !REDIRECT_URI) {
      return new Response('Facebook OAuth not configured', { status: 500 });
    }

    const state = encodeURIComponent(JSON.stringify({ 
      user_id, 
      platform: 'facebook'
    }));

    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'pages_manage_posts,pages_read_engagement,pages_show_list');
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
