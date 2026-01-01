# 🎯 Next Steps: Complete OAuth Setup

## ✅ What's Already Done

### Configured & Deployed
- ✅ Twitter OAuth - Credentials set, function deployed
- ✅ Facebook OAuth - Credentials set, function deployed
- ✅ Instagram OAuth - Redirect URI set, function deployed (uses Facebook credentials)
- ✅ All 6 Edge Functions deployed and ACTIVE
- ✅ Platform cards UI fixed (no more stretching)

### Edge Functions Deployed (All ACTIVE)
1. ✅ `twitter-auth`
2. ✅ `facebook-auth`
3. ✅ `instagram-auth`
4. ✅ `linkedin-auth`
5. ✅ `tiktok-auth`
6. ✅ `youtube-auth`
7. ✅ `oauth-callback`
8. ✅ `oauth-exchange`

---

## 🔑 What You Need to Do Now

You need to get OAuth credentials from the platform developer portals and configure them. Here's the exact process:

---

## 1️⃣ Update Twitter & Facebook (Add Redirect URIs)

### Twitter Developer Portal
1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Select your app
3. Go to "User authentication settings"
4. Add Callback URL: 
   ```
   https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
   ```
5. Save changes

### Facebook Developer Portal
1. Go to: https://developers.facebook.com/apps
2. Select your app
3. Go to Facebook Login → Settings
4. Add to "Valid OAuth Redirect URIs":
   ```
   https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
   ```
5. Save changes

### Add Frontend Client IDs
You need to add your actual client IDs to `.env.local`:

```bash
cd silent-pilot

# Edit .env.local and replace the placeholders:
# REACT_APP_FACEBOOK_APP_ID=your_actual_facebook_app_id
# REACT_APP_TWITTER_CLIENT_ID=your_actual_twitter_client_id
```

Get these from:
- Twitter: Developer Portal → Your App → Keys and tokens → Client ID
- Facebook: App Dashboard → Settings → Basic → App ID

---

## 2️⃣ Instagram (Uses Facebook - Just Enable Permissions)

Instagram uses the same Facebook App, so you just need to:

1. Go to your Facebook App Dashboard
2. Add "Instagram" product if not already added
3. Go to Instagram → Basic Display
4. Add Test Users or request permissions
5. Required permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `business_management`

**Note:** Instagram requires a Business or Creator account linked to a Facebook Page.

**Already Done:**
- ✅ Redirect URI configured in Supabase
- ✅ Edge Function deployed
- ✅ Uses same Facebook App ID

---

## 3️⃣ LinkedIn (Need Credentials)

### Get LinkedIn OAuth Credentials

1. **Go to:** https://www.linkedin.com/developers/
2. **Create an App:**
   - Click "Create app"
   - Fill in: App name, LinkedIn Page (create one if needed)
   - Upload logo and agree to terms

3. **Add Products:**
   - Go to Products tab
   - Add "Sign In with LinkedIn using OpenID Connect" (instant)
   - Request "Share on LinkedIn" (may need approval - 1-2 days)

4. **Configure OAuth Settings:**
   - Go to Auth tab
   - Add Redirect URL:
     ```
     https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
     ```

5. **Get Credentials:**
   - Go to Auth tab
   - Copy Client ID
   - Copy Client Secret

6. **Configure:**
   ```bash
   cd silent-pilot
   
   # Backend
   supabase secrets set LINKEDIN_CLIENT_ID=your_linkedin_client_id
   supabase secrets set LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   
   # Frontend (.env.local)
   echo 'REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id' >> .env.local
   ```

---

## 4️⃣ TikTok (Need Credentials - Requires Business)

### Get TikTok OAuth Credentials

1. **Go to:** https://developers.tiktok.com/
2. **Create an App:**
   - Sign in with TikTok account
   - Go to "Manage apps"
   - Click "Connect an app"

3. **Add Capabilities:**
   - Add "Login Kit"
   - Add "Content Posting API" (may require approval)

4. **Configure Redirect URI:**
   - Go to Login Kit settings
   - Add Redirect URI:
     ```
     https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
     ```

5. **Get Credentials:**
   - Go to App details
   - Copy Client Key (not Client ID for TikTok!)
   - Copy Client Secret

6. **Configure:**
   ```bash
   cd silent-pilot
   
   # Backend
   supabase secrets set TIKTOK_CLIENT_KEY=your_tiktok_client_key
   supabase secrets set TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
   
   # Frontend (.env.local)
   echo 'REACT_APP_TIKTOK_CLIENT_KEY=your_tiktok_client_key' >> .env.local
   ```

**Note:** TikTok requires business verification for Content Posting API. This can take 3-5 business days.

---

## 5️⃣ YouTube (Need Google Cloud Credentials)

### Get YouTube OAuth Credentials

1. **Go to:** https://console.cloud.google.com/
2. **Create/Select Project:**
   - Click project dropdown → "New Project"
   - Name: "Silent Pilot" or similar
   - Click Create

3. **Enable YouTube API:**
   - Go to APIs & Services → Library
   - Search "YouTube Data API v3"
   - Click Enable

4. **Create OAuth Credentials:**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth Client ID"
   - Configure consent screen if prompted:
     - User Type: External
     - App name: Silent Pilot
     - Support email: your email
     - Developer contact: your email
   - Application type: Web application
   - Name: Silent Pilot Web
   - Authorized redirect URIs:
     ```
     https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback
     ```
   - Click Create

5. **Get Credentials:**
   - Copy Client ID
   - Copy Client Secret

6. **Configure:**
   ```bash
   cd silent-pilot
   
   # Backend
   supabase secrets set GOOGLE_CLIENT_ID=your_google_client_id
   supabase secrets set GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Frontend (.env.local)
   echo 'REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id' >> .env.local
   ```

---

## 🧪 Testing

After configuring each platform:

1. **Restart dev server:**
   ```bash
   cd silent-pilot
   # Stop current server (Ctrl+C if running)
   npm start
   ```

2. **Test in browser:**
   - Go to: http://localhost:3000
   - Navigate to: Dashboard → Social Accounts
   - Click "Connect" on the platform you configured
   - Should redirect to platform OAuth (not demo mode!)
   - Authorize the app
   - Should redirect back and show connected account

3. **Check for errors:**
   - Open browser DevTools (F12)
   - Check Console for errors
   - If OAuth fails, check Edge Function logs:
     ```bash
     supabase functions logs oauth-callback --tail
     supabase functions logs oauth-exchange --tail
     ```

---

## 📋 Current Status Summary

| Platform | Backend | Frontend | Edge Function | Status |
|----------|---------|----------|---------------|--------|
| Twitter | ✅ Set | ⚠️ Need real ID | ✅ Deployed | Update redirect URI |
| Facebook | ✅ Set | ⚠️ Need real ID | ✅ Deployed | Update redirect URI |
| Instagram | ✅ Set | ✅ Uses Facebook | ✅ Deployed | Enable in FB app |
| LinkedIn | ❌ Need | ❌ Need | ✅ Deployed | Get credentials |
| TikTok | ❌ Need | ❌ Need | ✅ Deployed | Get credentials |
| YouTube | ❌ Need | ❌ Need | ✅ Deployed | Get credentials |

---

## 🎯 Recommended Order

**Option A: Quick Test (5 minutes)**
1. Get your actual Twitter Client ID from developer portal
2. Get your actual Facebook App ID from developer portal
3. Update `.env.local` with real IDs
4. Update redirect URIs in Twitter and Facebook portals
5. Restart server and test Twitter & Facebook

**Option B: Full Setup (1-2 hours)**
1. Complete Option A first
2. Enable Instagram in Facebook app (5 min)
3. Set up LinkedIn OAuth (15 min)
4. Set up YouTube OAuth (20 min)
5. Set up TikTok OAuth (20 min + wait for approval)

**Option C: As Needed**
- Set up only the platforms your users actually need
- Start with Twitter & Facebook (already have credentials)
- Add others based on user demand

---

## 💡 Tips

- **Start with Twitter & Facebook** - You already have the credentials!
- **Instagram is easiest** - Just uses Facebook credentials
- **LinkedIn is medium** - Quick approval for basic features
- **YouTube is medium** - Google Cloud setup can be confusing
- **TikTok is hardest** - Requires business verification (3-5 days)

- Keep credentials in a password manager
- Never commit secrets to git
- Test one platform at a time
- Check Edge Function logs if something fails

---

## 🆘 If You Get Stuck

1. **OAuth redirect fails:**
   - Check redirect URI matches exactly in platform settings
   - Verify Edge Function is deployed: `supabase functions list`

2. **"OAuth not configured" message:**
   - Check client ID is in `.env.local`
   - Restart dev server after changing `.env.local`
   - Verify client ID doesn't contain "your_" or placeholders

3. **Token exchange fails:**
   - Check Edge Function logs: `supabase functions logs oauth-exchange`
   - Verify client secret is set: `supabase secrets list`
   - Check platform OAuth settings match

4. **Account connects but can't post:**
   - Verify required permissions/scopes in platform settings
   - Check Edge Function logs: `supabase functions logs social-post`
   - Some platforms require additional approval

---

## 📞 Quick Reference Links

- **Twitter Dev:** https://developer.twitter.com/en/portal/dashboard
- **Facebook Dev:** https://developers.facebook.com/apps
- **LinkedIn Dev:** https://www.linkedin.com/developers/
- **TikTok Dev:** https://developers.tiktok.com/
- **Google Cloud:** https://console.cloud.google.com/

- **Supabase Dashboard:** https://supabase.com/dashboard/project/qzvqnhbslecjjwakusva/functions
- **Your Redirect URI:** `https://qzvqnhbslecjjwakusva.functions.supabase.co/oauth-callback`

---

**Ready to start?** Begin with Twitter & Facebook since you already have credentials! 🚀
