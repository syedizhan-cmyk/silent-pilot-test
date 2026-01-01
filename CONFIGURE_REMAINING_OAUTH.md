# Configure Remaining OAuth Platforms

## Current Status

### ✅ Already Configured
- **Twitter** - Client ID and Secret set in Supabase
- **Facebook** - App ID and Secret set in Supabase

### ⚠️ Need Configuration
- **Instagram** (uses Facebook OAuth)
- **LinkedIn**
- **TikTok**
- **YouTube**

---

## Quick Setup Commands

### 1. Instagram (Uses Facebook App)

Instagram uses the same Facebook App ID, just needs redirect URI:

```bash
cd silent-pilot

# Instagram uses the Facebook credentials, just set redirect URI
supabase secrets set INSTAGRAM_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback

# Frontend already has Facebook App ID
```

**Note:** Make sure your Facebook App has Instagram Basic Display and Instagram Graph API enabled.

---

### 2. LinkedIn

#### Register App
1. Go to: https://www.linkedin.com/developers/
2. Create an App
3. Add "Sign In with LinkedIn using OpenID Connect" product
4. Request "Share on LinkedIn" product (may need approval)
5. Add Redirect URL: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`

#### Get Credentials
- Client ID from App settings
- Client Secret from Auth tab

#### Configure
```bash
cd silent-pilot

# Backend (Supabase)
supabase secrets set LINKEDIN_CLIENT_ID=your_linkedin_client_id
supabase secrets set LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
supabase secrets set LINKEDIN_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback

# Frontend (.env.local)
echo 'REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id' >> .env.local
```

---

### 3. TikTok

#### Register App
1. Go to: https://developers.tiktok.com/
2. Create an App
3. Add "Login Kit" and "Content Posting API" capabilities
4. Configure Redirect URI: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
5. Required scopes: `user.info.basic`, `video.upload`, `video.publish`

#### Get Credentials
- Client Key (not Client ID for TikTok)
- Client Secret

#### Configure
```bash
cd silent-pilot

# Backend (Supabase)
supabase secrets set TIKTOK_CLIENT_KEY=your_tiktok_client_key
supabase secrets set TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
supabase secrets set TIKTOK_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback

# Frontend (.env.local)
echo 'REACT_APP_TIKTOK_CLIENT_KEY=your_tiktok_client_key' >> .env.local
```

---

### 4. YouTube (Google OAuth)

#### Register App
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create OAuth 2.0 Client ID (Web application)
5. Add Authorized redirect URI: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`

#### Get Credentials
- Client ID
- Client Secret

#### Configure
```bash
cd silent-pilot

# Backend (Supabase)
supabase secrets set GOOGLE_CLIENT_ID=your_google_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=your_google_client_secret
supabase secrets set YOUTUBE_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback

# Frontend (.env.local)
echo 'REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id' >> .env.local
```

---

## Required Global Secrets

Make sure these are set:

```bash
cd silent-pilot

# Set app URL for OAuth redirects
supabase secrets set APP_URL=https://silent-pilot-website.vercel.app

# Or for local development
supabase secrets set APP_URL=http://localhost:3000

# Supabase service role key (if not already set)
supabase secrets set SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Deploy Edge Functions

After configuring credentials, deploy the Edge Functions:

```bash
cd silent-pilot

# Deploy all OAuth functions
supabase functions deploy facebook-auth
supabase functions deploy instagram-auth
supabase functions deploy linkedin-auth
supabase functions deploy tiktok-auth
supabase functions deploy youtube-auth
supabase functions deploy oauth-callback
supabase functions deploy oauth-exchange

# Verify deployment
supabase functions list
```

---

## Update Platform OAuth Settings

For each platform you configured, you need to update their developer portals:

### Twitter
- Callback URL: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
- Type: Web App
- Scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`

### Facebook
- Valid OAuth Redirect URIs: 
  - `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
- Permissions: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`

### Instagram
- Same Facebook app settings
- Additional permissions: `instagram_basic`, `instagram_content_publish`, `business_management`
- Must have Instagram Business account

### LinkedIn
- Redirect URLs: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
- Scopes: `w_member_social`, `r_liteprofile`, `r_emailaddress`

### TikTok
- Redirect URI: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
- Scopes: `user.info.basic`, `video.upload`, `video.publish`

### YouTube
- Authorized redirect URIs: `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`
- Scopes: `https://www.googleapis.com/auth/youtube.upload`, `https://www.googleapis.com/auth/youtube.readonly`

---

## Testing

After configuration:

1. **Restart dev server** if running locally
   ```bash
   # Stop current server (Ctrl+C)
   npm start
   ```

2. **Test connections**
   - Navigate to: Dashboard → Social Accounts
   - Click "Connect" on each platform
   - Should redirect to platform OAuth (not demo mode)
   - Authorize and redirect back
   - Check account appears in "Connected Accounts"

3. **Check logs if issues**
   ```bash
   # View Edge Function logs
   supabase functions logs oauth-callback --tail
   supabase functions logs oauth-exchange --tail
   ```

---

## Priority Order (Recommended)

If you want to enable platforms gradually:

1. ✅ **Twitter** - Already done
2. ✅ **Facebook** - Already done
3. 🔜 **Instagram** - Easiest (uses Facebook)
4. 🔜 **LinkedIn** - Medium difficulty
5. 🔜 **YouTube** - Medium difficulty
6. 🔜 **TikTok** - Requires business approval

---

## Quick Commands Summary

```bash
cd silent-pilot

# Instagram (uses Facebook credentials)
supabase secrets set INSTAGRAM_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback

# LinkedIn (get credentials from linkedin.com/developers)
supabase secrets set LINKEDIN_CLIENT_ID=xxx
supabase secrets set LINKEDIN_CLIENT_SECRET=xxx
supabase secrets set LINKEDIN_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
echo 'REACT_APP_LINKEDIN_CLIENT_ID=xxx' >> .env.local

# TikTok (get credentials from developers.tiktok.com)
supabase secrets set TIKTOK_CLIENT_KEY=xxx
supabase secrets set TIKTOK_CLIENT_SECRET=xxx
supabase secrets set TIKTOK_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
echo 'REACT_APP_TIKTOK_CLIENT_KEY=xxx' >> .env.local

# YouTube (get credentials from console.cloud.google.com)
supabase secrets set GOOGLE_CLIENT_ID=xxx
supabase secrets set GOOGLE_CLIENT_SECRET=xxx
supabase secrets set YOUTUBE_REDIRECT_URI=https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
echo 'REACT_APP_GOOGLE_CLIENT_ID=xxx' >> .env.local

# Global settings
supabase secrets set APP_URL=https://silent-pilot-website.vercel.app

# Deploy all functions
supabase functions deploy facebook-auth
supabase functions deploy instagram-auth
supabase functions deploy linkedin-auth
supabase functions deploy tiktok-auth
supabase functions deploy youtube-auth
supabase functions deploy oauth-callback

# Restart dev server
npm start
```

---

Need help with a specific platform? Let me know which one you want to set up first!
