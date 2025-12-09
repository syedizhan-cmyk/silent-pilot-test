// Edge Function: linkedin-auth
// Starts LinkedIn OAuth by redirecting the user to LinkedIn's authorization URL
// Requires secrets: LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID');
    const REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI');

    const state = encodeURIComponent(JSON.stringify({ user_id }));

    const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID!);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI!);
    authUrl.searchParams.set('scope', 'r_liteprofile r_emailaddress w_member_social');
    authUrl.searchParams.set('state', state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl.toString() },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
