// Social Account Validation Edge Function
// Validates that social accounts are still connected and tokens are valid

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

    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ valid: false, needsReauth: true, error: 'Account not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    const isExpired = account.expires_at && new Date(account.expires_at) < new Date();
    
    if (isExpired && !account.refresh_token) {
      return new Response(
        JSON.stringify({ valid: false, needsReauth: true, error: 'Token expired' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate with platform API
    let isValid = false;
    try {
      switch (account.platform) {
        case 'facebook':
        case 'instagram':
          isValid = await validateFacebook(account.access_token);
          break;
        case 'twitter':
          isValid = await validateTwitter(account.access_token);
          break;
        case 'linkedin':
          isValid = await validateLinkedIn(account.access_token);
          break;
        case 'youtube':
          isValid = await validateGoogle(account.access_token);
          break;
        default:
          isValid = true; // Assume valid if we can't check
      }
    } catch (error) {
      console.error('Validation error:', error);
      isValid = false;
    }

    return new Response(
      JSON.stringify({ 
        valid: isValid, 
        needsReauth: !isValid && !account.refresh_token,
        canRefresh: !isValid && !!account.refresh_token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Account validation error:', error);
    return new Response(
      JSON.stringify({ valid: false, needsReauth: true, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function validateFacebook(accessToken: string): Promise<boolean> {
  const response = await fetch(
    `https://graph.facebook.com/me?access_token=${accessToken}`
  );
  return response.ok;
}

async function validateTwitter(accessToken: string): Promise<boolean> {
  const response = await fetch('https://api.twitter.com/2/users/me', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  return response.ok;
}

async function validateLinkedIn(accessToken: string): Promise<boolean> {
  const response = await fetch('https://api.linkedin.com/v2/me', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  return response.ok;
}

async function validateGoogle(accessToken: string): Promise<boolean> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  return response.ok;
}
