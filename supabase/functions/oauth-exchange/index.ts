// OAuth Token Exchange Edge Function
// Securely exchanges authorization codes for access tokens
// This keeps client secrets on the server side

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { platform, code, userId, redirectUri, codeVerifier } = await req.json();

    if (!platform || !code || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let tokenData;
    let profileData;

    // Exchange code for token based on platform
    switch (platform) {
      case 'facebook':
      case 'instagram':
        tokenData = await exchangeFacebookToken(code, redirectUri);
        profileData = await fetchFacebookProfile(tokenData.access_token);
        break;
      
      case 'twitter':
        tokenData = await exchangeTwitterToken(code, redirectUri, codeVerifier);
        profileData = await fetchTwitterProfile(tokenData.access_token);
        break;
      
      case 'linkedin':
        tokenData = await exchangeLinkedInToken(code, redirectUri);
        profileData = await fetchLinkedInProfile(tokenData.access_token);
        break;
      
      case 'tiktok':
        tokenData = await exchangeTikTokToken(code, redirectUri);
        profileData = await fetchTikTokProfile(tokenData.access_token);
        break;
      
      case 'youtube':
        tokenData = await exchangeGoogleToken(code, redirectUri);
        profileData = await fetchGoogleProfile(tokenData.access_token);
        break;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Store in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;

    // Use upsert to handle reconnecting existing accounts
    const { data, error } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: userId,
        platform: platform,
        account_name: profileData.name || profileData.username || `${platform} Account`,
        account_id: profileData.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_at: expiresAt,
        is_active: true,
        metadata: {
          profile: profileData,
          scope: tokenData.scope,
        },
      }, {
        onConflict: 'user_id,platform,account_id'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, account: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OAuth exchange error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Facebook/Instagram token exchange
async function exchangeFacebookToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('FACEBOOK_APP_ID');
  const clientSecret = Deno.env.get('FACEBOOK_APP_SECRET');

  const response = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `code=${code}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook token exchange failed: ${error}`);
  }

  return await response.json();
}

async function fetchFacebookProfile(accessToken: string) {
  const response = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
  );
  
  if (!response.ok) throw new Error('Failed to fetch Facebook profile');
  return await response.json();
}

// Twitter/X token exchange
async function exchangeTwitterToken(code: string, redirectUri: string, codeVerifier: string) {
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
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token exchange failed: ${error}`);
  }

  return await response.json();
}

async function fetchTwitterProfile(accessToken: string) {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch Twitter profile');
  const data = await response.json();
  return { id: data.data.id, username: data.data.username, name: data.data.name };
}

// LinkedIn token exchange
async function exchangeLinkedInToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
  const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }

  return await response.json();
}

async function fetchLinkedInProfile(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch LinkedIn profile');
  const data = await response.json();
  return { 
    id: data.id, 
    name: `${data.localizedFirstName} ${data.localizedLastName}`,
    username: data.id,
  };
}

// TikTok token exchange
async function exchangeTikTokToken(code: string, redirectUri: string) {
  const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY');
  const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET');

  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: clientKey!,
      client_secret: clientSecret!,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TikTok token exchange failed: ${error}`);
  }

  return await response.json();
}

async function fetchTikTokProfile(accessToken: string) {
  const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch TikTok profile');
  const data = await response.json();
  return { 
    id: data.data.user.open_id, 
    username: data.data.user.display_name,
    name: data.data.user.display_name,
  };
}

// Google/YouTube token exchange
async function exchangeGoogleToken(code: string, redirectUri: string) {
  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code: code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }

  return await response.json();
}

async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) throw new Error('Failed to fetch Google profile');
  const data = await response.json();
  return { id: data.id, name: data.name, username: data.email };
}
