# 🐦 Twitter/X OAuth Setup - Quick Guide

## Why Twitter First?

- ✅ Takes only 10 minutes
- ✅ No app review required
- ✅ Works immediately
- ✅ Straightforward process
- ✅ Free tier available

---

## 🚀 Step-by-Step Setup

### Step 1: Create Twitter Developer Account (2 minutes)

1. Go to: **https://developer.twitter.com/en/portal/dashboard**
2. Sign in with your Twitter account
3. Click **"Sign up for Free Account"** if needed
4. Accept the Developer Agreement

### Step 2: Create a Project & App (3 minutes)

1. Click **"+ Create Project"**
2. Fill in:
   - **Project Name**: `Silent Pilot`
   - **Use Case**: Select "Making a bot" or "Building tools for Twitter users"
   - **Project Description**: `Social media management platform`

3. Click **"Next"** and create app:
   - **App Name**: `silent-pilot-app` (must be unique across Twitter)
   - Click **"Complete"**

### Step 3: Get Your OAuth 2.0 Credentials (2 minutes)

After creating the app, you'll see your keys.

1. Click on **"Keys and tokens"** tab
2. Under **"OAuth 2.0 Client ID and Client Secret"**:
   - Click **"Generate"** if not already generated
   - Copy **Client ID** (save it!)
   - Copy **Client Secret** (save it!)
   - **Keep these safe!**

### Step 4: Configure OAuth Settings (2 minutes)

1. Go to **"Settings"** tab in your app
2. Scroll to **"User authentication settings"**
3. Click **"Set up"**
4. Configure:
   - **App permissions**: Select **"Read and write"**
   - **Type of App**: Select **"Web App"**
   - **App info**:
     - **Callback URI**: `http://localhost:3000/oauth/callback`
     - **Website URL**: `http://localhost:3000`
   - Click **"Save"**

### Step 5: Add Credentials to Your App (1 minute)

**Tell me your Client ID and Client Secret, and I'll add them to your .env file!**

Or if you want to do it yourself:
1. Open your `.env` file
2. Find these lines:
   ```
   REACT_APP_TWITTER_CLIENT_ID=
   REACT_APP_TWITTER_CLIENT_SECRET=
   ```
3. Add your credentials:
   ```
   REACT_APP_TWITTER_CLIENT_ID=your_client_id_here
   REACT_APP_TWITTER_CLIENT_SECRET=your_client_secret_here
   ```
4. Save the file

---

## ⚠️ Important Notes

### Twitter API Tiers

**Free Tier:**
- ✅ Post tweets (limit: 1,500/month)
- ✅ OAuth authentication
- ✅ Read user data
- ✅ Perfect for testing

**Basic Tier ($100/month):**
- 10,000 tweets/month
- More API access

**You can start with Free tier and upgrade later!**

---

## 🎯 After Setup

Once you have your credentials:

1. I'll add them to your .env
2. Deploy Twitter secrets to Supabase
3. Restart your app
4. Connect Twitter account
5. Post your first tweet! 🎉

---

## 📋 Checklist

- [ ] Created Twitter Developer account
- [ ] Created project and app
- [ ] Generated OAuth 2.0 credentials
- [ ] Configured callback URI
- [ ] Have Client ID
- [ ] Have Client Secret
- [ ] Ready to add to .env!

---

## 🆘 Troubleshooting

### "App name already taken"
Try: `silent-pilot-yourname` or add numbers

### "Callback URI invalid"
Must be exactly: `http://localhost:3000/oauth/callback`

### "Can't generate OAuth 2.0 keys"
Make sure you selected "Web App" in user authentication settings

---

**Start with Step 1 and let me know when you have your Client ID and Client Secret!** 🚀
