// Edge Function: oauth-callback
// Universal OAuth callback handler for all social platforms
// Handles the OAuth redirect and exchanges code for tokens

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      const errorDescription = url.searchParams.get('error_description') || error;
      return redirectToApp(`error=${encodeURIComponent(errorDescription)}`);
    }

    if (!code || !state) {
      return redirectToApp('error=Missing authorization code or state');
    }

    // Decode state to get user_id and platform
    let stateData;
    try {
      stateData = JSON.parse(decodeURIComponent(state));
    } catch (e) {
      return redirectToApp('error=Invalid state parameter');
    }

    const { user_id, platform, code_verifier } = stateData;

    if (!user_id || !platform) {
      return redirectToApp('error=Invalid state data');
    }

    // Get the appropriate redirect URI for this platform
    const redirectUri = getRedirectUri(platform);

    // Exchange code for tokens via oauth-exchange function
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error: exchangeError } = await supabase.functions.invoke('oauth-exchange', {
      body: {
        platform,
        code,
        userId: user_id,
        redirectUri,
        codeVerifier: code_verifier || null,
      }
    });

    if (exchangeError) {
      return redirectToApp(`error=${encodeURIComponent(exchangeError.message)}`);
    }

    // Success - redirect back to the app
    return redirectToApp(`success=true&platform=${platform}`);

  } catch (e) {
    console.error('OAuth callback error:', e);
    return redirectToApp(`error=${encodeURIComponent(e.message)}`);
  }
});

function getRedirectUri(platform: string): string {
  const envVar = `${platform.toUpperCase()}_REDIRECT_URI`;
  return Deno.env.get(envVar) || Deno.env.get('OAUTH_REDIRECT_URI') || '';
}

function redirectToApp(queryString: string): Response {
  const appUrl = Deno.env.get('APP_URL') || 'http://localhost:3000';
  const redirectUrl = `${appUrl}/oauth/callback?${queryString}`;
  
  return new Response(null, {
    status: 302,
    headers: { Location: redirectUrl },
  });
}
