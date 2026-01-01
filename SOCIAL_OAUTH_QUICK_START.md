# Social Media OAuth - Quick Start

## 🚀 Quick Setup (5 minutes)

### Option 1: Demo Mode (No Configuration Needed)
Works immediately for testing:
- Click "Connect" on any platform in Social Accounts page
- Demo connection is created instantly
- Test the UI and workflow
- Posts are simulated (not sent to real platforms)

### Option 2: Production Mode (Real OAuth)

#### Step 1: Choose a Platform to Start With
We recommend starting with **Twitter/X** (easiest setup):

#### Step 2: Create Twitter Developer Account
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Sign up and create a new project & app
3. Enable OAuth 2.0 in "User authentication settings"
4. Set Callback URL: `https://YOUR_SUPABASE_PROJECT.functions.supabase.co/oauth-callback`
5. Copy your **Client ID** and **Client Secret**

#### Step 3: Configure Frontend
Add to `silent-pilot/.env`:
```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
REACT_APP_TWITTER_CLIENT_ID=your_twitter_client_id
```

#### Step 4: Configure Supabase Secrets
```bash
cd silent-pilot
supabase secrets set TWITTER_CLIENT_ID=your_client_id
supabase secrets set TWITTER_CLIENT_SECRET=your_client_secret
supabase secrets set TWITTER_REDIRECT_URI=https://your-supabase-project.functions.supabase.co/oauth-callback
supabase secrets set APP_URL=https://yourapp.com
```

#### Step 5: Deploy Edge Functions
```bash
supabase functions deploy twitter-auth
supabase functions deploy oauth-callback
supabase functions deploy oauth-exchange
```

#### Step 6: Test Connection
1. Restart your React app: `npm start`
2. Go to Dashboard → Social Accounts
3. Click "Connect" on Twitter/X
4. You'll be redirected to Twitter OAuth
5. Authorize the app
6. Success! Your Twitter account is now connected

## 📋 Platform-Specific Client ID/Key Names

Each platform uses different terminology:

| Platform | Frontend Env Variable | What to Get |
|----------|----------------------|-------------|
| Twitter/X | `REACT_APP_TWITTER_CLIENT_ID` | Client ID from Developer Portal |
| Facebook | `REACT_APP_FACEBOOK_APP_ID` | App ID from App Dashboard |
| Instagram | `REACT_APP_FACEBOOK_APP_ID` | Same as Facebook |
| LinkedIn | `REACT_APP_LINKEDIN_CLIENT_ID` | Client ID from App Settings |
| TikTok | `REACT_APP_TIKTOK_CLIENT_KEY` | Client Key from Developer Portal |
| YouTube | `REACT_APP_GOOGLE_CLIENT_ID` | Client ID from Google Cloud Console |

## 🔑 Required Supabase Secrets Per Platform

### Twitter/X
```bash
supabase secrets set TWITTER_CLIENT_ID=xxx
supabase secrets set TWITTER_CLIENT_SECRET=xxx
supabase secrets set TWITTER_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### Facebook
```bash
supabase secrets set FACEBOOK_APP_ID=xxx
supabase secrets set FACEBOOK_APP_SECRET=xxx
supabase secrets set FACEBOOK_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### Instagram
```bash
supabase secrets set FACEBOOK_APP_ID=xxx
supabase secrets set FACEBOOK_APP_SECRET=xxx
supabase secrets set INSTAGRAM_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### LinkedIn
```bash
supabase secrets set LINKEDIN_CLIENT_ID=xxx
supabase secrets set LINKEDIN_CLIENT_SECRET=xxx
supabase secrets set LINKEDIN_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### TikTok
```bash
supabase secrets set TIKTOK_CLIENT_KEY=xxx
supabase secrets set TIKTOK_CLIENT_SECRET=xxx
supabase secrets set TIKTOK_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### YouTube
```bash
supabase secrets set GOOGLE_CLIENT_ID=xxx
supabase secrets set GOOGLE_CLIENT_SECRET=xxx
supabase secrets set YOUTUBE_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback
```

### Global
```bash
supabase secrets set APP_URL=https://yourapp.com
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 Deploy All Edge Functions at Once

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
supabase functions deploy oauth-refresh
supabase functions deploy social-validate
```

## 🧪 Testing Checklist

- [ ] Demo mode works (no configuration)
- [ ] OAuth redirect initiates correctly
- [ ] Platform authorization page loads
- [ ] Callback returns to app successfully
- [ ] Account shows up in "Connected Accounts"
- [ ] Can create and post content
- [ ] Can disconnect account
- [ ] Can reconnect same account

## 🐛 Common Issues

### "OAuth not configured" or Demo mode always activating
- ✅ Check client ID is in `.env` file
- ✅ Restart React dev server after changing `.env`
- ✅ Verify client ID doesn't contain `your_` or `undefined`

### OAuth redirect fails or shows error
- ✅ Verify redirect URI in platform settings matches exactly
- ✅ Check Edge Functions are deployed: `supabase functions list`
- ✅ Verify secrets are set: `supabase secrets list`

### "Failed to exchange authorization code"
- ✅ Check Edge Function logs: `supabase functions logs oauth-exchange`
- ✅ Verify client secret is set correctly
- ✅ Ensure redirect URI matches in both places

### Account connects but posts fail
- ✅ Check platform API permissions/scopes
- ✅ Review Edge Function logs: `supabase functions logs social-post`
- ✅ Verify token hasn't expired
- ✅ Check platform-specific API limits

## 📚 Full Documentation

See `SOCIAL_MEDIA_SETUP.md` for detailed setup instructions for each platform.

## 🎯 Next Steps After Connecting

1. **Test Posting**: Create content and post to connected platform
2. **Schedule Posts**: Use Calendar to schedule future posts
3. **AutoPilot**: Enable automated content generation and posting
4. **Analytics**: Track performance across all platforms
5. **Add More Platforms**: Repeat setup for additional platforms

## 💡 Tips

- Start with one platform (Twitter recommended)
- Test demo mode first to understand the flow
- Keep client secrets in Supabase only (never in code)
- Use environment-specific redirect URIs (dev/staging/prod)
- Monitor Edge Function logs during testing
- Check platform rate limits before scheduling many posts
