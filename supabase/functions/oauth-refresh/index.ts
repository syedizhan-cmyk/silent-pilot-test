// OAuth Token Refresh Edge Function
// Refreshes expired access tokens using refresh tokens

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accountId } = await req.json();

    if (!accountId) {
      return new Response(
        JSON.stringify({ error: 'Missing accountId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get account
    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    if (!account.refresh_token) {
      throw new Error('No refresh token available. Please reconnect your account.');
    }

    // Refresh token based on platform
    let newTokenData;
    switch (account.platform) {
      case 'facebook':
      case 'instagram':
        newTokenData = await refreshFacebookToken(account.refresh_token);
        break;
      case 'twitter':
        newTokenData = await refreshTwitterToken(account.refresh_token);
        break;
      case 'linkedin':
        newTokenData = await refreshLinkedInToken(account.refresh_token);
        break;
      case 'youtube':
        newTokenData = await refreshGoogleToken(account.refresh_token);
        break;
      default:
        throw new Error(`Token refresh not supported for ${account.platform}`);
    }

    // Update account with new tokens
    const expiresAt = newTokenData.expires_in
      ? new Date(Date.now() + newTokenData.expires_in * 1000).toISOString()
      : null;

    const { error: updateError } = await supabase
      .from('social_accounts')
      .update({
        access_token: newTokenData.access_token,
        refresh_token: newTokenData.refresh_token || account.refresh_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', accountId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Token refresh error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Platform-specific refresh functions
async function refreshFacebookToken(refreshToken: string) {
  const clientId = Deno.env.get('FACEBOOK_APP_ID');
  const clientSecret = Deno.env.get('FACEBOOK_APP_SECRET');

  const response = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `fb_exchange_token=${refreshToken}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook token refresh failed: ${error}`);
  }

  return await response.json();
}

async function refreshTwitterToken(refreshToken: string) {
  const clientId = Deno.env.get('TWITTER_CLIENT_ID');
  const clientSecret = Deno.env.get('TWITTER_CLIENT_SECRET');
  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token refresh failed: ${error}`);
  }

  return await response.json();
}

async function refreshLinkedInToken(refreshToken: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token refresh failed: ${error}`);
  }

  return await response.json();
}

async function refreshGoogleToken(refreshToken: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token refresh failed: ${error}`);
  }

  return await response.json();
}
