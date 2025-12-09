// Edge Function: linkedin-callback
// Handles LinkedIn OAuth callback, exchanges code for access token, and stores it in social_accounts
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const CLIENT_ID = Deno.env.get('LINKEDIN_CLIENT_ID')!;
    const CLIENT_SECRET = Deno.env.get('LINKEDIN_CLIENT_SECRET')!;
    const REDIRECT_URI = Deno.env.get('LINKEDIN_REDIRECT_URI')!;

    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    };

    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const stateStr = url.searchParams.get('state');

    if (!code || !stateStr) {
      return new Response('Missing code/state', { status: 400 });
    }

    const state = JSON.parse(decodeURIComponent(stateStr));
    const user_id = state.user_id as string;

    // Exchange code for token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    });

    if (!tokenRes.ok) {
      const msg = await tokenRes.text();
      return new Response(`Token exchange failed: ${msg}`, { status: 500 });
    }

    const tokens = await tokenRes.json();

    // Save to social_accounts
    await fetch(`${SUPABASE_URL}/rest/v1/social_accounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        user_id,
        platform: 'linkedin',
        account_name: 'LinkedIn Account',
        account_id: 'me',
        access_token: tokens.access_token,
        expires_at: new Date(Date.now() + (tokens.expires_in || 0) * 1000).toISOString(),
        is_active: true,
        metadata: { scope: tokens.scope }
      })
    });

    return new Response('LinkedIn connected! You can close this tab and return to the app.', { status: 200 });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});
