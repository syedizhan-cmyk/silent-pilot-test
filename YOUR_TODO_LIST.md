# 📝 YOUR TO-DO LIST - What You Need To Do

## ✅ What I've Already Done For You

I've completed all the coding and setup that can be automated:

- ✅ Written all the OAuth integration code
- ✅ Created 4 backend edge functions
- ✅ Created database schema
- ✅ Updated your .env file with placeholder variables
- ✅ Created comprehensive documentation
- ✅ Set up demo mode fallback
- ✅ Created helper scripts

**Everything is coded and ready - you just need OAuth credentials!**

---

## 🎯 YOUR TASKS (30 minutes total)

### TASK 1: Get Facebook OAuth Credentials (10 minutes)

**Why Facebook?** It's the easiest and fastest to set up.

**What you'll do:**

1. **Go to Facebook Developers** → https://developers.facebook.com/
   - Log in with your Facebook account
   - Click "Get Started" if first time

2. **Create an App**
   - Click "Create App"
   - Choose type: **"Business"**
   - App name: `Silent Pilot` (or whatever you want)
   - Contact email: Your email
   - Click "Create App"

3. **Get Your Credentials**
   - Go to Settings → Basic (in left sidebar)
   - Copy **App ID** 1482734112820631
   - Click "Show" and copy **App Secret** 8a4f5161c32389e5eed68dba9efdfae2
   - **SAVE THESE!** You need them next 

4. **Add Website Platform**
   - Scroll down, click "Add Platform"
   - Choose "Website"
   - Site URL: `http://localhost:3000`
   - Save

5. **Add Facebook Login Product**
   - In left sidebar: Click "Add Product"
   - Find "Facebook Login" → Click "Set Up"
   - Choose "Web"
   - In Facebook Login Settings, add Valid OAuth Redirect URI:
     ```
     http://localhost:3000/oauth/callback
     ```
   - Save

6. **Create a Facebook Page** (IMPORTANT!)
   - Go to: https://www.facebook.com/pages/create
   - Create any type of page (you'll post to this page)
   - **Why?** Facebook API posts to Pages, not personal profiles

**Time: ~10 minutes**

---

### TASK 2: Add Credentials to .env (1 minute)

1. Open your `.env` file in the project
2. Find these lines (I added them for you):
   ```
   REACT_APP_FACEBOOK_APP_ID=
   REACT_APP_FACEBOOK_APP_SECRET=
   ```
3. Add your credentials:
   ```
   REACT_APP_FACEBOOK_APP_ID=1234567890123456
   REACT_APP_FACEBOOK_APP_SECRET=abc123def456...
   ```
4. Save the file

**Time: 1 minute**

---

### TASK 3: Run Database SQL (3 minutes)

1. **Go to Supabase Dashboard** → https://supabase.com
2. Click on your project
3. Left sidebar → **"SQL Editor"**
4. Click **"New Query"**
5. Open `SOCIAL_MEDIA_INTEGRATION_SQL.sql` from your project folder
6. Copy ALL the contents
7. Paste into Supabase SQL Editor
8. Click **"Run"** (or Ctrl/Cmd + Enter)
9. Should say "Success"

**Time: 3 minutes**

---

### TASK 4: Install Supabase CLI (2 minutes)

Open your terminal in the project folder:

```bash
npm install -g supabase
```

Wait for it to install, then verify:

```bash
supabase --version
```

**Time: 2 minutes**

---

### TASK 5: Deploy Edge Functions (10 minutes)

In your terminal:

```bash
# 1. Login to Supabase (opens browser)
supabase login

# 2. Link your project
# Get YOUR_PROJECT_REF from your Supabase dashboard URL
# URL looks like: https://app.supabase.com/project/YOUR_PROJECT_REF
supabase link --project-ref YOUR_PROJECT_REF

# 3. Set secrets
# Replace with your actual Facebook credentials
supabase secrets set FACEBOOK_APP_ID=your_actual_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_actual_app_secret

# Get these from Supabase Dashboard → Settings → API
supabase secrets set SUPABASE_URL=your_supabase_project_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 4. Deploy all functions
supabase functions deploy

# 5. Verify
supabase functions list
```

**Where to find Supabase credentials:**
- Dashboard → Settings → API
- Copy "Project URL" 
- Copy "service_role" key (NOT anon key)

**Time: 10 minutes**

---

### TASK 6: Test It! (2 minutes)

```bash
# Restart your dev server (important for .env changes)
npm start
```

Then:

1. Open browser → http://localhost:3000
2. Login to Silent Pilot
3. Go to **Dashboard → Social Connect**
4. Click **"Connect"** on Facebook
5. Authorize the app
6. Should see success message! ✅

**Create your first post:**
1. Go to "Create Content"
2. Write: "Testing Silent Pilot! 🚀"
3. Select your Facebook account
4. Click "Publish Now"
5. Check your Facebook Page - it should be there! 🎉

**Time: 2 minutes**

---

## 📋 QUICK CHECKLIST

- [ ] Created Facebook Developer account
- [ ] Created Facebook App
- [ ] Got App ID and App Secret
- [ ] Added redirect URI to Facebook app
- [ ] Created Facebook Page
- [ ] Added credentials to `.env` file
- [ ] Ran SQL in Supabase SQL Editor
- [ ] Installed Supabase CLI
- [ ] Logged into Supabase CLI
- [ ] Linked project
- [ ] Set secrets
- [ ] Deployed functions
- [ ] Restarted dev server (`npm start`)
- [ ] Tested connection
- [ ] Made first post

---

## 🎯 TOTAL TIME: ~30 MINUTES

- Facebook setup: 10 min
- Add to .env: 1 min
- Database SQL: 3 min
- Install CLI: 2 min
- Deploy functions: 10 min
- Test: 2 min

---

## ❓ IF YOU GET STUCK

### "Where is my Facebook App Secret?"
→ Facebook App Dashboard → Settings → Basic → Click "Show" button

### "Invalid Redirect URI error"
→ Must be exactly: `http://localhost:3000/oauth/callback` in Facebook Login settings

### "Supabase CLI command not found"
→ Run: `npm install -g supabase` (you may need sudo on Mac/Linux)

### "Where is my Supabase Project Ref?"
→ Look at your Supabase dashboard URL: `https://app.supabase.com/project/[THIS_IS_YOUR_REF]`

### "Posts not appearing on Facebook"
→ Make sure you created a Facebook Page! Facebook API doesn't post to personal profiles.

### "Token exchange failed"
→ Check that you set the secrets in Supabase with the correct values

---

## 🎉 AFTER YOU'RE DONE

You'll be able to:
- ✅ Connect real Facebook accounts
- ✅ Actually post to Facebook Pages
- ✅ Schedule posts
- ✅ Use AutoPilot with real posting
- ✅ No more "Demo Mode"!

---

## 🚀 READY TO START?

**Start with TASK 1** → Go to https://developers.facebook.com/ and create your app!

All the code is done - you just need to get those OAuth credentials and deploy! 💪

**Need the detailed step-by-step?** Open `SETUP_CHECKLIST_FOR_YOU.md` for screenshots and more details.

---

## 📞 WANT TO ADD MORE PLATFORMS LATER?

Once Facebook works, you can add:
- **Twitter/X** (~15 minutes)
- **LinkedIn** (~12 minutes)  
- **Instagram** (uses Facebook credentials + Business account)

See `SOCIAL_MEDIA_SETUP_GUIDE.md` for those platforms.

---

**You got this! 30 minutes and you'll have real social media integration working! 🎉**
