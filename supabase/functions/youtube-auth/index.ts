// Edge Function: youtube-auth
// Starts YouTube OAuth by redirecting the user to Google's authorization URL
// Requires secrets: GOOGLE_CLIENT_ID, YOUTUBE_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const REDIRECT_URI = Deno.env.get('YOUTUBE_REDIRECT_URI');

    if (!CLIENT_ID || !REDIRECT_URI) {
      return new Response('YouTube OAuth not configured', { status: 500 });
    }

    const state = encodeURIComponent(JSON.stringify({ 
      user_id, 
      platform: 'youtube'
    }));

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl.toString() },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
