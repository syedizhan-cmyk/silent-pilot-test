# ✅ Setup Checklist - What I've Done & What You Need To Do

## ✅ COMPLETED BY ME (Automated)

### 1. Code Implementation ✅
- [x] Created `src/lib/socialAuth.js` - OAuth authentication
- [x] Created `src/lib/socialMediaAPI.js` - API functions
- [x] Updated `src/store/socialStore.js` - Real posting logic
- [x] Updated `src/pages/SocialConnect.js` - Connection UI
- [x] Updated `src/pages/OAuthCallback.js` - Callback handler

### 2. Backend Functions ✅
- [x] Created `supabase/functions/oauth-exchange/index.ts`
- [x] Created `supabase/functions/social-post/index.ts`
- [x] Created `supabase/functions/oauth-refresh/index.ts`
- [x] Created `supabase/functions/social-validate/index.ts`

### 3. Database Schema ✅
- [x] Created `SOCIAL_MEDIA_INTEGRATION_SQL.sql`

### 4. Configuration ✅
- [x] Updated `.env.example` with OAuth variables
- [x] Added OAuth variables to your `.env` file
- [x] Set redirect URI to `http://localhost:3000/oauth/callback`

### 5. Documentation ✅
- [x] Created complete setup guides
- [x] Created quick start guide
- [x] Created testing guide
- [x] Created deployment guide

---

## 🎯 WHAT YOU NEED TO DO (Manual Steps)

### Step 1: Choose Your Platform (PICK ONE TO START)

I recommend **Facebook** - it's the easiest!

**Options:**
- 🟢 **Facebook** (Easiest, ~10 minutes)
- 🟡 **Twitter/X** (Medium, ~15 minutes)
- 🟡 **LinkedIn** (Medium, ~12 minutes)
- 🔴 **Instagram** (Requires Facebook first)

---

## 🚀 FACEBOOK SETUP (RECOMMENDED - 10 MINUTES)

### Step 1.1: Create Facebook Developer Account (2 minutes)

1. Go to: https://developers.facebook.com/
2. Log in with your Facebook account
3. Click "Get Started" or "My Apps"
4. Accept developer terms if prompted

### Step 1.2: Create a New App (3 minutes)

1. Click "Create App" button
2. Choose app type: **"Business"**
3. Fill in the details:
   - **App Display Name**: `Silent Pilot` (or your choice)
   - **App Contact Email**: Your email
   - **App Purpose**: Choose "Yourself or your own business"
4. Click "Create App"
5. Complete security check if prompted

### Step 1.3: Get Your Credentials (2 minutes)

1. You'll be in your new app dashboard
2. On the left sidebar, click **"Settings" → "Basic"**
3. You'll see:
   - **App ID**: Copy this number
   - **App Secret**: Click "Show" button, then copy it
4. **SAVE THESE!** You'll need them in the next step

### Step 1.4: Configure Your App (3 minutes)

#### A. Add Website Platform:
1. Scroll down to "Add Platform"
2. Click "Website"
3. In "Site URL" enter: `http://localhost:3000`
4. Click "Save Changes"

#### B. Add Facebook Login:
1. In the left sidebar, find "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Skip the quickstart (click "Settings" in left sidebar under Facebook Login)
5. In "Valid OAuth Redirect URIs" add:
   ```
   http://localhost:3000/oauth/callback
   ```
6. Click "Save Changes"

#### C. Add Required Permissions:
1. In left sidebar, go to "App Review" → "Permissions and Features"
2. Request these permissions:
   - `pages_manage_posts` - Click "Request"
   - `pages_read_engagement` - Click "Request"
3. These will be in "Development Mode" which is fine for testing

### Step 1.5: Add Credentials to Your .env File (1 minute)

1. Open your `.env` file in your project
2. Find these lines:
   ```
   REACT_APP_FACEBOOK_APP_ID=
   REACT_APP_FACEBOOK_APP_SECRET=
   ```
3. Add your credentials:
   ```
   REACT_APP_FACEBOOK_APP_ID=your_app_id_here
   REACT_APP_FACEBOOK_APP_SECRET=your_app_secret_here
   ```
4. **IMPORTANT**: Replace `your_app_id_here` with the actual App ID
5. Replace `your_app_secret_here` with the actual App Secret
6. Save the file

### Step 1.6: Restart Your Dev Server (1 minute)

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm start
```

### Step 1.7: Create a Facebook Page (Required for Posting)

**IMPORTANT**: You need a Facebook Page to post to Facebook.

1. Go to: https://www.facebook.com/pages/create
2. Click "Get Started"
3. Choose page type: "Business or Brand"
4. Fill in:
   - **Page Name**: Your business/project name
   - **Category**: Choose relevant category
5. Click "Create Page"
6. You can skip adding photos/bio for now

**Why?** Facebook API posts to Pages, not personal profiles.

---

## 🗄️ DATABASE SETUP (5 MINUTES)

### Step 2.1: Access Supabase Dashboard

1. Go to: https://supabase.com
2. Log in to your project
3. Click on your Silent Pilot project

### Step 2.2: Run the SQL Schema

1. In left sidebar, click **"SQL Editor"**
2. Click **"New Query"**
3. Open the file `SOCIAL_MEDIA_INTEGRATION_SQL.sql` from your project
4. Copy **ALL** the contents
5. Paste into the SQL Editor
6. Click **"Run"** button (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

This creates all the necessary tables and security policies.

---

## ☁️ DEPLOY EDGE FUNCTIONS (10 MINUTES)

### Step 3.1: Login to Supabase CLI

```bash
supabase login
```

This will open your browser for authentication.

### Step 3.2: Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

**Where to find PROJECT_REF:**
1. Go to your Supabase dashboard
2. Look at the URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`
3. Copy that PROJECT_REF part

### Step 3.3: Set Your Secrets in Supabase

```bash
# Facebook credentials (use your actual values!)
supabase secrets set FACEBOOK_APP_ID=your_actual_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_actual_app_secret

# Supabase credentials (get from dashboard Settings > API)
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Where to find Supabase credentials:**
1. Supabase Dashboard → Settings → API
2. **Project URL**: Copy "Project URL"
3. **service_role key**: Copy "service_role" key (NOT anon key)

### Step 3.4: Deploy the Functions

```bash
# Deploy all functions
supabase functions deploy oauth-exchange
supabase functions deploy social-post
supabase functions deploy oauth-refresh
supabase functions deploy social-validate
```

Or deploy all at once:
```bash
supabase functions deploy
```

### Step 3.5: Verify Deployment

```bash
supabase functions list
```

You should see all 4 functions listed.

---

## 🧪 TEST IT! (2 MINUTES)

### Step 4.1: Start Your App

```bash
npm start
```

### Step 4.2: Go to Social Connect

1. Open browser to: http://localhost:3000
2. Log in to your Silent Pilot account
3. Navigate to: **Dashboard → Social Connect**

### Step 4.3: Connect Facebook

1. Click **"Connect"** button on Facebook
2. You'll be redirected to Facebook
3. Log in and authorize the app
4. You'll be redirected back to Silent Pilot
5. You should see a success message! ✅

### Step 4.4: Make Your First Post

1. Go to **"Create Content"** or **"Calendar"**
2. Write a test post: "Testing my Silent Pilot integration! 🚀"
3. Select your Facebook account
4. Click **"Publish Now"**
5. Check your Facebook Page - your post should be there! 🎉

---

## 📋 QUICK REFERENCE

### What You Need From Facebook:
- [ ] App ID
- [ ] App Secret
- [ ] Facebook Page created

### What You Need From Supabase:
- [ ] Project URL
- [ ] Service Role Key
- [ ] Project Reference

### Commands You'll Run:
```bash
supabase login
supabase link --project-ref YOUR_REF
supabase secrets set FACEBOOK_APP_ID=xxx
supabase secrets set FACEBOOK_APP_SECRET=xxx
supabase secrets set SUPABASE_URL=xxx
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=xxx
supabase functions deploy
npm start
```

---

## 🎯 ESTIMATED TIME

- **Facebook OAuth Setup**: 10 minutes
- **Database Setup**: 5 minutes
- **Deploy Functions**: 10 minutes
- **Testing**: 2 minutes

**Total**: ~27 minutes to full working integration!

---

## ❓ NEED HELP?

### "Can't find App Secret"
- Click the "Show" button next to it in Facebook Settings → Basic

### "Invalid Redirect URI"
- Make sure it's exactly: `http://localhost:3000/oauth/callback`
- No trailing slash, includes http://

### "Supabase CLI not found"
- Install with: `npm install -g supabase`

### "Functions won't deploy"
- Make sure you're in the project root directory
- Check that `supabase/functions/` folder exists

### "Posts not appearing on Facebook"
- Make sure you created a Facebook Page (not posting to personal profile)
- Reconnect your account after creating the page

---

## 🎉 ONCE YOU'RE DONE

You'll be able to:
✅ Connect real Facebook accounts
✅ Post content that actually appears on Facebook
✅ Schedule posts for later
✅ Use AutoPilot with real accounts
✅ Track all your posts

---

## 🚀 WANT TO ADD MORE PLATFORMS?

Once Facebook is working, you can add:
- **Twitter/X** - See `SOCIAL_MEDIA_SETUP_GUIDE.md` section 2
- **LinkedIn** - See `SOCIAL_MEDIA_SETUP_GUIDE.md` section 3
- **Instagram** - Uses same Facebook credentials + Business account

---

**Ready to start?** Begin with Facebook Step 1.1 above! 🚀

I've done all the code work - you just need to get the OAuth credentials and deploy!
