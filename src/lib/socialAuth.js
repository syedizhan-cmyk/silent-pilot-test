// Social Media OAuth Integration
// Handles OAuth flows for various platforms with real API integration

import { supabase } from './supabase';

const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || window.location.origin + '/oauth/callback';

export const SocialAuthConfig = {
  facebook: {
    clientId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scopes: [],
    responseType: 'code',
  },
  instagram: {
    clientId: process.env.REACT_APP_FACEBOOK_APP_ID || '', // Instagram uses Facebook OAuth
    authUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement', 'business_management'],
    responseType: 'code',
  },
  twitter: {
    clientId: process.env.REACT_APP_TWITTER_CLIENT_ID || '',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    responseType: 'code',
  },
  linkedin: {
    clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID || '',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
    responseType: 'code',
  },
  tiktok: {
    clientId: process.env.REACT_APP_TIKTOK_CLIENT_KEY || '',
    authUrl: 'https://www.tiktok.com/v2/auth/authorize',
    scopes: ['user.info.basic', 'video.upload', 'video.publish'],
    responseType: 'code',
  },
  youtube: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.force-ssl'],
    responseType: 'code',
  },
};

// Generate PKCE code verifier and challenge (for OAuth 2.0 with PKCE)
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

// Generate state parameter for CSRF protection
function generateState(platform, userId) {
  const stateData = {
    platform,
    userId,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substring(7),
  };
  return btoa(JSON.stringify(stateData));
}

// Check if OAuth is properly configured for a platform
export function isOAuthConfigured(platform) {
  const config = SocialAuthConfig[platform];
  if (!config) return false;
  
  const clientId = config.clientId;
  return clientId && 
         clientId.length > 0 && 
         !clientId.includes('your_') && 
         clientId !== 'undefined';
}

// Get list of all configured platforms
export function getConfiguredPlatforms() {
  return Object.keys(SocialAuthConfig).filter(isOAuthConfigured);
}

// Initiate OAuth flow for a platform
export async function initiateOAuth(platform, userId) {
  const config = SocialAuthConfig[platform];
  
  if (!config) {
    throw new Error(`Platform ${platform} not supported`);
  }

  if (!config.clientId) {
    throw new Error(`${platform} OAuth not configured. Please add REACT_APP_${platform.toUpperCase()}_CLIENT_ID to your .env file.`);
  }

  const state = generateState(platform, userId);
  const codeVerifier = generateCodeVerifier();
  
  // Store state and code verifier in sessionStorage
  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_platform', platform);
  
  // Store code verifier for Twitter PKCE
  if (platform === 'twitter') {
    sessionStorage.setItem('oauth_code_verifier', codeVerifier);
  }

  // Build OAuth URL
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: REDIRECT_URI,
    response_type: config.responseType,
    scope: config.scopes.join(' '),
    state: state,
  });

  // Platform-specific parameters
  if (platform === 'twitter') {
    // PKCE for Twitter/X - using SHA-256
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
  }

  if (platform === 'youtube') {
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');
  }

  if (platform === 'facebook' || platform === 'instagram') {
    params.set('display', 'popup');
  }

  const authUrl = `${config.authUrl}?${params.toString()}`;
  
  // Redirect to OAuth provider
  window.location.href = authUrl;
}

// Handle OAuth callback (called from callback page)
export async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    alert(`Authentication failed: ${errorDescription || error}`);
    window.location.href = '/dashboard/social-connect';
    return;
  }

  if (!code || !state) {
    console.error('Missing code or state parameter');
    alert('Authentication failed: Missing parameters');
    window.location.href = '/dashboard/social-connect';
    return;
  }

  // Verify state parameter (CSRF protection)
  const savedState = sessionStorage.getItem('oauth_state');
  if (state !== savedState) {
    console.error('State mismatch - possible CSRF attack');
    alert('Security error: State mismatch. Please try again.');
    sessionStorage.clear();
    window.location.href = '/dashboard/social-connect';
    return;
  }

  try {
    // Decode state to get platform and userId
    const stateData = JSON.parse(atob(state));
    const { platform, userId } = stateData;
    const savedPlatform = sessionStorage.getItem('oauth_platform');

    if (platform !== savedPlatform) {
      throw new Error('Platform mismatch');
    }

    console.log(`Processing OAuth callback for ${platform}...`);

    // Get code verifier for PKCE (Twitter)
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    
    console.log('OAuth callback - Platform:', platform);
    console.log('OAuth callback - Code:', code ? 'present' : 'missing');
    console.log('OAuth callback - Code verifier:', codeVerifier ? codeVerifier : 'missing');
    console.log('OAuth callback - Redirect URI:', REDIRECT_URI);

    // Use Supabase Edge Function to securely exchange code for token
    // This keeps client secrets on the server side
    const { data: tokenData, error: tokenError} = await supabase.functions.invoke(
      'oauth-exchange',
      {
        body: {
          platform,
          code,
          userId,
          redirectUri: REDIRECT_URI,
          codeVerifier: codeVerifier,
        },
      }
    );

    if (tokenError) {
      console.error('Token exchange error:', tokenError);
      throw new Error(tokenError.message || 'Failed to exchange authorization code');
    }

    if (!tokenData || !tokenData.success) {
      throw new Error(tokenData?.error || 'Failed to connect account');
    }

    console.log(`Successfully connected ${platform}!`);

    // Clean up session storage
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_platform');
    sessionStorage.removeItem('oauth_code_verifier');

    // Redirect back to social connect page with success message
    window.location.href = `/dashboard/social-connect?success=true&platform=${platform}`;
  } catch (error) {
    console.error('OAuth callback error:', error);
    alert(`Failed to connect account: ${error.message}`);
    sessionStorage.clear();
    window.location.href = '/dashboard/social-connect';
  }
}

// Quick connect with mock data (for testing/demo purposes when OAuth is not configured)
export function quickConnectDemo(platform, userId) {
  console.warn(`Using demo mode for ${platform}. Configure OAuth credentials to enable real connections.`);
  return {
    platform: platform,
    accountId: `demo_${platform}_${Date.now()}`,
    accountName: `Demo ${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
    accessToken: `demo_token_${platform}_${Date.now()}`,
    refreshToken: `demo_refresh_${platform}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    isDemo: true, // Flag to indicate this is a demo connection
  };
}
