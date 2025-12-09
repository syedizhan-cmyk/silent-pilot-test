# 🚀 Quick Start: Social Media Integration

Get your Silent Pilot connected to real social media platforms in 15 minutes!

## ⚡ Fast Track (Facebook Only)

Want to test it quickly? Start with Facebook - it's the easiest to set up.

### 1. Create a Facebook App (5 minutes)

1. Go to https://developers.facebook.com/
2. Click "My Apps" → "Create App"
3. Select "Business" type
4. Enter app details:
   - **App Name**: Silent Pilot (or your choice)
   - **Contact Email**: Your email
5. Click "Create App"

### 2. Get Your Credentials (2 minutes)

In your new app dashboard:

1. Go to **Settings** → **Basic**
2. Copy your **App ID** 
3. Copy your **App Secret** (click "Show")
4. Scroll down to "Add Platform" → Choose "Website"
5. Enter **Site URL**: `http://localhost:3000`
6. Save changes

### 3. Configure OAuth Redirect (1 minute)

1. In left sidebar, click **Facebook Login** → **Settings**
2. Add to **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3000/oauth/callback
   ```
3. Save changes

### 4. Add Credentials to Your App (1 minute)

Open your `.env` file and add:

```bash
REACT_APP_FACEBOOK_APP_ID=your_app_id_here
REACT_APP_FACEBOOK_APP_SECRET=your_app_secret_here
REACT_APP_REDIRECT_URI=http://localhost:3000/oauth/callback
```

**Important**: Replace `your_app_id_here` and `your_app_secret_here` with actual values!

### 5. Set Up Database (2 minutes)

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy contents of `SOCIAL_MEDIA_INTEGRATION_SQL.sql`
5. Paste and run it

### 6. Deploy Edge Functions (4 minutes)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref from Supabase dashboard)
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set FACEBOOK_APP_ID=your_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_app_secret

# Deploy the OAuth exchange function
supabase functions deploy oauth-exchange

# Deploy the social post function
supabase functions deploy social-post
```

### 7. Test It! (1 minute)

```bash
# Restart your app to load new .env variables
npm start
```

1. Go to http://localhost:3000/dashboard/social-connect
2. Click **Connect** on Facebook
3. Authorize the app
4. See success message! ✅

---

## 🎯 What You Can Do Now

### Create Your First Post

1. Go to **Create Content** or **Calendar**
2. Write your post content
3. Select your connected Facebook account
4. Click **Publish Now** or **Schedule**
5. Your post goes live on Facebook! 🎉

### Post to Your Facebook Page

**Important**: To post to Facebook, you need a Facebook Page:

1. Create a page at https://www.facebook.com/pages/create
2. Reconnect your Facebook account in Silent Pilot
3. The app will automatically detect your page
4. Posts will be published to your page!

---

## 🔄 Add More Platforms

Once Facebook is working, add other platforms:

### Twitter/X (10 minutes)

1. Go to https://developer.twitter.com/
2. Create a project and app
3. Enable OAuth 2.0
4. Get Client ID and Secret
5. Add to `.env`:
   ```bash
   REACT_APP_TWITTER_CLIENT_ID=your_client_id
   REACT_APP_TWITTER_CLIENT_SECRET=your_client_secret
   ```
6. Set secrets in Supabase:
   ```bash
   supabase secrets set TWITTER_CLIENT_ID=your_client_id
   supabase secrets set TWITTER_CLIENT_SECRET=your_client_secret
   ```
7. Connect in dashboard!

### LinkedIn (8 minutes)

1. Go to https://www.linkedin.com/developers/
2. Create an app
3. Add "Sign In with LinkedIn" and "Share on LinkedIn" products
4. Get Client ID and Secret
5. Add to `.env` and Supabase secrets
6. Connect in dashboard!

### Instagram (requires Facebook)

1. Instagram uses Facebook OAuth
2. Link Instagram Business account to Facebook Page
3. Use same Facebook credentials
4. Connect Instagram in dashboard!

---

## 🎓 Testing Tips

### Demo Mode vs Real Mode

**Demo Mode** (No OAuth configured):
- Posts are simulated, not actually published
- Good for testing the UI
- Shows "Demo Mode" badge

**Real Mode** (OAuth configured):
- Posts actually go to social platforms
- Uses real API calls
- Shows platform connection status

### Test Safely

1. **Use test accounts**: Create test social media accounts for development
2. **Private posts**: Make initial posts private/unlisted
3. **Test pages**: Create test Facebook pages and Instagram business accounts
4. **Check logs**: Monitor Supabase function logs for errors

---

## 🐛 Common Issues & Solutions

### "OAuth not configured" - Still showing demo mode

**Solution**:
```bash
# 1. Check .env file has the credentials
cat .env | grep FACEBOOK

# 2. Restart development server
npm start

# 3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

### "Invalid redirect URI"

**Solution**:
- Verify OAuth redirect in Facebook app matches exactly: `http://localhost:3000/oauth/callback`
- No trailing slash
- Include `http://` protocol

### "Edge function not found"

**Solution**:
```bash
# Deploy functions
supabase functions deploy oauth-exchange
supabase functions deploy social-post

# Verify deployment
supabase functions list
```

### "Token exchange failed"

**Solution**:
```bash
# Check function logs
supabase functions logs oauth-exchange

# Verify secrets are set
supabase secrets list

# Re-set secrets if needed
supabase secrets set FACEBOOK_APP_ID=your_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_app_secret
```

### "No Facebook pages found"

**Solution**:
1. Create a Facebook Page at https://www.facebook.com/pages/create
2. In Facebook App settings, add "pages_manage_posts" permission
3. Reconnect your account

---

## 📋 Quick Checklist

Before testing, verify:

- [ ] OAuth app created on platform
- [ ] Credentials added to `.env` file
- [ ] Development server restarted after `.env` changes
- [ ] Database schema applied in Supabase
- [ ] Edge functions deployed to Supabase
- [ ] Secrets set in Supabase
- [ ] Redirect URI matches in OAuth app and `.env`
- [ ] Facebook Page created (for Facebook posting)
- [ ] Instagram Business account (for Instagram posting)

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ "Connect" button doesn't show "Demo Mode" message
2. ✅ Redirected to platform's OAuth page
3. ✅ Redirected back with success message
4. ✅ Account shows in "Connected Accounts" section
5. ✅ Can create and publish posts
6. ✅ Posts appear on actual social media platform

---

## 📚 Next Steps

Once basic posting works:

1. **Schedule Posts** - Set up future posts
2. **Multiple Platforms** - Connect more social accounts
3. **AutoPilot** - Enable automated posting
4. **Analytics** - Track post performance
5. **AI Content** - Use AI to generate post ideas

---

## 🆘 Need Help?

1. Check `SOCIAL_MEDIA_SETUP_GUIDE.md` for detailed platform instructions
2. Review `IMPLEMENTATION_COMPLETE.md` for architecture details
3. Check `DEPLOY_EDGE_FUNCTIONS.md` for deployment help
4. Look at Supabase function logs for API errors

---

**Ready to go?** Start with Step 1 above and you'll be posting to Facebook in 15 minutes! 🚀
