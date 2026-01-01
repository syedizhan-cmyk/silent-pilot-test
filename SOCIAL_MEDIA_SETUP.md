# Social Media Integration Setup Guide

This guide walks you through setting up OAuth connections for all supported social media platforms in Silent Pilot.

## Overview

Silent Pilot supports connecting the following platforms:
- ✅ Twitter/X
- ✅ LinkedIn
- ✅ Facebook
- ✅ Instagram (via Facebook)
- ✅ TikTok
- ✅ YouTube (via Google)

## Architecture

The integration uses a secure OAuth 2.0 flow:
1. **Frontend** - Stores only public client IDs
2. **Supabase Edge Functions** - Handles OAuth flows and stores secrets securely
3. **Database** - Stores encrypted access tokens

## Demo Mode vs Production Mode

### Demo Mode (Default)
- Works out of the box without configuration
- Allows testing the UI and flow
- Posts are simulated (not actually sent to platforms)
- Great for development and testing

### Production Mode
- Requires OAuth app registration with each platform
- Real posting to social media platforms
- Secure token management
- Required environment variables configured

## Setup Instructions

### 1. Frontend Configuration (.env)

Add these variables to your `.env` file:

```bash
# Supabase (Required)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# Social Media OAuth Client IDs (Public - safe to expose)
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
REACT_APP_TWITTER_CLIENT_ID=your_twitter_client_id
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
REACT_APP_TIKTOK_CLIENT_KEY=your_tiktok_client_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Supabase Edge Functions Secrets

Configure these secrets in Supabase (never commit these!):

```bash
# Set secrets using Supabase CLI
supabase secrets set FACEBOOK_APP_ID=your_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_app_secret
supabase secrets set FACEBOOK_REDIRECT_URI=https://yourapp.com/oauth/callback

supabase secrets set TWITTER_CLIENT_ID=your_client_id
supabase secrets set TWITTER_CLIENT_SECRET=your_client_secret
supabase secrets set TWITTER_REDIRECT_URI=https://yourapp.com/oauth/callback

supabase secrets set LINKEDIN_CLIENT_ID=your_client_id
supabase secrets set LINKEDIN_CLIENT_SECRET=your_client_secret
supabase secrets set LINKEDIN_REDIRECT_URI=https://yourapp.com/oauth/callback

supabase secrets set INSTAGRAM_REDIRECT_URI=https://yourapp.com/oauth/callback

supabase secrets set TIKTOK_CLIENT_KEY=your_client_key
supabase secrets set TIKTOK_CLIENT_SECRET=your_client_secret
supabase secrets set TIKTOK_REDIRECT_URI=https://yourapp.com/oauth/callback

supabase secrets set GOOGLE_CLIENT_ID=your_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=your_client_secret
supabase secrets set YOUTUBE_REDIRECT_URI=https://yourapp.com/oauth/callback

# App URL for redirects
supabase secrets set APP_URL=https://yourapp.com
```

### 3. Platform-Specific Setup

#### Twitter/X OAuth 2.0

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new App or select existing one
3. Navigate to "User authentication settings"
4. Enable OAuth 2.0
5. Set Type of App: "Web App"
6. Add Callback URL: `https://your-supabase-project.functions.supabase.co/oauth-callback`
7. Copy Client ID and Client Secret
8. Required scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`

#### Facebook Pages

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create an App, choose "Business" type
3. Add "Facebook Login" product
4. Configure OAuth Redirect URIs:
   - `https://your-supabase-project.functions.supabase.co/oauth-callback`
5. Go to Settings > Basic
6. Copy App ID and App Secret
7. Required permissions: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`

#### Instagram Business

Instagram uses Facebook OAuth with additional permissions:
1. Same setup as Facebook above
2. Add Instagram product to your Facebook app
3. Required permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `business_management`
4. Must have Instagram Business or Creator account linked to Facebook Page

#### LinkedIn

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an App
3. Add "Sign In with LinkedIn using OpenID Connect" product
4. Request "Share on LinkedIn" and "Advertising API" products (requires approval)
5. Add Redirect URL: `https://your-supabase-project.functions.supabase.co/oauth-callback`
6. Copy Client ID and Client Secret
7. Required scopes: `w_member_social`, `r_liteprofile`, `r_emailaddress`

#### TikTok for Business

1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Create an App
3. Add "Login Kit" and "Content Posting API" capabilities
4. Configure Redirect URI: `https://your-supabase-project.functions.supabase.co/oauth-callback`
5. Copy Client Key and Client Secret
6. Required scopes: `user.info.basic`, `video.upload`, `video.publish`

#### YouTube (Google OAuth)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create OAuth 2.0 Client ID (Web application)
5. Add Authorized redirect URI: `https://your-supabase-project.functions.supabase.co/oauth-callback`
6. Copy Client ID and Client Secret
7. Required scopes: `https://www.googleapis.com/auth/youtube.upload`, `https://www.googleapis.com/auth/youtube.readonly`

### 4. Deploy Edge Functions

Deploy the OAuth edge functions to Supabase:

```bash
cd silent-pilot

# Deploy all social auth functions
supabase functions deploy twitter-auth
supabase functions deploy facebook-auth
supabase functions deploy instagram-auth
supabase functions deploy linkedin-auth
supabase functions deploy tiktok-auth
supabase functions deploy youtube-auth
supabase functions deploy oauth-callback
supabase functions deploy oauth-exchange
supabase functions deploy social-post
```

### 5. Database Setup

The `social_accounts` table should already exist with these columns:
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `platform` (text) - twitter, facebook, instagram, etc.
- `account_name` (text)
- `account_id` (text) - Platform's user ID
- `access_token` (text) - Encrypted
- `refresh_token` (text) - Encrypted
- `expires_at` (timestamp)
- `is_active` (boolean)
- `metadata` (jsonb) - Additional platform-specific data
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Testing

### Test Demo Mode
1. Start the app without configuring OAuth
2. Go to Social Accounts page
3. Click "Connect" on any platform
4. You'll see a demo connection created
5. Posts will be simulated but not actually sent

### Test Production Mode
1. Configure OAuth for at least one platform
2. Restart your app
3. Go to Social Accounts page
4. Click "Connect" on configured platform
5. You'll be redirected to the platform's OAuth page
6. Authorize the app
7. You'll be redirected back with account connected
8. Posts will now be sent to the real platform

## Troubleshooting

### "OAuth not configured" message
- Check that client IDs are set in frontend `.env`
- Verify client IDs don't contain `your_` or `undefined`
- Restart development server after changing `.env`

### OAuth redirect fails
- Verify redirect URIs match exactly in platform settings
- Check Supabase Edge Functions are deployed
- Verify secrets are set in Supabase

### Token exchange fails
- Check Supabase Edge Function logs: `supabase functions logs oauth-exchange`
- Verify all required secrets are set
- Check redirect URI matches what was used in auth initiation

### Posts fail to send
- Verify account is still connected (tokens may expire)
- Check platform-specific API limits
- Review Edge Function logs: `supabase functions logs social-post`
- Ensure required permissions/scopes are granted

## Security Best Practices

1. **Never commit secrets** - Use environment variables and Supabase secrets
2. **Use HTTPS only** - OAuth requires secure connections
3. **Rotate tokens** - Implement refresh token logic for expired tokens
4. **Minimal scopes** - Only request permissions you actually need
5. **Validate state** - CSRF protection is built into the OAuth flow
6. **Encrypt tokens** - Access tokens are sensitive, keep them encrypted in DB

## Rate Limits

Be aware of platform rate limits:
- **Twitter**: 50 tweets per 24 hours (user context)
- **Facebook**: Varies by page, typically 25-100 posts per day
- **Instagram**: 25 API calls per user per 24 hours
- **LinkedIn**: 100 posts per person per day
- **TikTok**: 10 videos per day for most accounts
- **YouTube**: 10,000 quota units per day (1 video = ~1600 units)

## Support

For issues or questions:
1. Check Supabase Edge Function logs
2. Review browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test with demo mode first to isolate OAuth issues
5. Check platform-specific developer documentation

## Next Steps

After connecting social accounts:
1. Try creating content in the Create Content page
2. Schedule posts in the Calendar
3. Set up AutoPilot for automated posting
4. View analytics in the Analytics dashboard
