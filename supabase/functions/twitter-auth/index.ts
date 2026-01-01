// Edge Function: twitter-auth
// Starts Twitter OAuth by redirecting the user to Twitter's authorization URL
// Requires secrets: TWITTER_CLIENT_ID, TWITTER_REDIRECT_URI

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { encode as base64UrlEncode } from "https://deno.land/std@0.177.0/encoding/base64url.ts";

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get('user_id');
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    const CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    const REDIRECT_URI = Deno.env.get('TWITTER_REDIRECT_URI');

    if (!CLIENT_ID || !REDIRECT_URI) {
      return new Response('Twitter OAuth not configured', { status: 500 });
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const state = encodeURIComponent(JSON.stringify({ 
      user_id, 
      platform: 'twitter',
      code_verifier: codeVerifier 
    }));

    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.set('scope', 'tweet.read tweet.write users.read offline.access');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl.toString() },
    });
  } catch (e) {
    return new Response(`Error: ${e.message}`, { status: 500 });
  }
});

function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}
