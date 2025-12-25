# 🚀 Vercel Environment Variables Setup Guide

## Overview
This guide shows you how to securely add API keys to Vercel so they're never exposed in Git or public code.

---

## How Vercel Environment Variables Work

### ✅ SECURE WAY (What we're doing):
```
Git Repository (public) → No secrets
                ↓
Vercel Dashboard (secure) → API keys stored encrypted
                ↓
Vercel Build Process → Keys injected during build
                ↓
Production Website → Keys used, never exposed
```

### ❌ INSECURE WAY (What we USED to do):
```
.env file (with secrets) → Git Repository (PUBLIC!)
                ↓
Anyone can see your API keys on GitHub ← HACKED!
```

---

## STEP 1: Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Log in with your account
3. Find **silent-pilot-website** project
4. Click to open it

---

## STEP 2: Go to Environment Variables

1. Click **Settings** (top menu bar)
2. Click **Environment Variables** (left sidebar)
3. You should see existing variables (if any)

---

## STEP 3: Add Each API Key

### For Each Variable Below:

1. Click **"Add New"** button
2. Fill in:
   - **Name:** (exact name from below)
   - **Value:** (paste your regenerated API key)
   - **Environments:** Check ONLY **Production**
3. Click **Save**
4. Repeat for next variable

---

## Variables to Add (In Order)

### 1️⃣ REACT_APP_SUPABASE_URL
- **Name:** `REACT_APP_SUPABASE_URL`
- **Value:** `https://qzvqnhbslecjjwakusva.supabase.co`
- **Environments:** ✅ Production
- **Status:** ⏳ Ready to add

### 2️⃣ REACT_APP_SUPABASE_ANON_KEY ⚠️ REGENERATED
- **Name:** `REACT_APP_SUPABASE_ANON_KEY`
- **Value:** [YOUR NEW ROTATED KEY FROM SUPABASE]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://app.supabase.com
  2. Select "Silent Pilot Website" project
  3. Settings → API → Find "Anon public"
  4. Click "Rotate"
  5. Copy new key
  6. Paste here
- **Status:** ⏳ Waiting for regeneration

### 3️⃣ REACT_APP_OPENAI_API_KEY ⚠️ EXPOSED - REGENERATE
- **Name:** `REACT_APP_OPENAI_API_KEY`
- **Value:** [YOUR NEW API KEY]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://platform.openai.com/account/api-keys
  2. Delete old key: `sk-proj-HU9tmFxL-7brhHpaJK3tZM8uf4y3oE9TI7AcsqSJ5Hz9_0_...`
  3. Click "+ Create new secret key"
  4. Copy new key
  5. Paste here
- **Status:** ⏳ Waiting for regeneration

### 4️⃣ REACT_APP_GEMINI_API_KEY ⚠️ EXPOSED - REGENERATE
- **Name:** `REACT_APP_GEMINI_API_KEY`
- **Value:** [YOUR NEW API KEY]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://console.cloud.google.com/apis/credentials
  2. Delete old key: `AIzaSyD2kbQzQN8bkE1wKpCjVRl1BXGI0nazZm4`
  3. Click "Create Credentials" → "API Key"
  4. Copy new key
  5. Paste here
- **Status:** ⏳ Waiting for regeneration

### 5️⃣ REACT_APP_GROQ_API_KEY ⚠️ EXPOSED - REGENERATE
- **Name:** `REACT_APP_GROQ_API_KEY`
- **Value:** [YOUR NEW API KEY]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://console.groq.com/keys
  2. Delete old key: `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`
  3. Click "Create New API Key"
  4. Copy new key
  5. Paste here
- **Status:** ⏳ Waiting for regeneration

### 6️⃣ REACT_APP_DEEPAI_API_KEY (Optional)
- **Name:** `REACT_APP_DEEPAI_API_KEY`
- **Value:** [YOUR CURRENT KEY OR NEW ONE]
- **Environments:** ✅ Production
- **Current:** `f470256d-1f19-499d-9f4d-0ea14d4ee85a`
- **Status:** ⏳ Can add current or regenerate

### 7️⃣ REACT_APP_FACEBOOK_APP_SECRET ⚠️ EXPOSED - REGENERATE
- **Name:** `REACT_APP_FACEBOOK_APP_SECRET`
- **Value:** [YOUR NEW SECRET]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://developers.facebook.com
  2. Select your app
  3. Settings → Basic
  4. Click "Show" next to App Secret
  5. Click "Reset App Secret"
  6. Confirm
  7. Copy new secret
  8. Paste here
- **Status:** ⏳ Waiting for regeneration

### 8️⃣ REACT_APP_TWITTER_CLIENT_SECRET ⚠️ EXPOSED - REGENERATE
- **Name:** `REACT_APP_TWITTER_CLIENT_SECRET`
- **Value:** [YOUR NEW SECRET]
- **Environments:** ✅ Production
- **Instructions:**
  1. Go to https://developer.twitter.com/en/portal/dashboard
  2. Select your app
  3. Keys and Tokens
  4. API Key and Secret
  5. Click "Regenerate" next to Client Secret
  6. Copy new secret
  7. Paste here
- **Status:** ⏳ Waiting for regeneration

### 9️⃣ REACT_APP_STRIPE_PUBLISHABLE_KEY (Test Key - Safe)
- **Name:** `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_51ShjdCF60t7FOH7Ii37NGt2`
- **Environments:** ✅ Production
- **Status:** ✅ Safe to add now (test key)
- **Note:** Will replace with live key when going to production

---

## STEP 4: Verify All Variables Are Added

After adding all 9 variables, you should see them listed:
- ✅ REACT_APP_SUPABASE_URL
- ✅ REACT_APP_SUPABASE_ANON_KEY
- ✅ REACT_APP_OPENAI_API_KEY
- ✅ REACT_APP_GEMINI_API_KEY
- ✅ REACT_APP_GROQ_API_KEY
- ✅ REACT_APP_DEEPAI_API_KEY
- ✅ REACT_APP_FACEBOOK_APP_SECRET
- ✅ REACT_APP_TWITTER_CLIENT_SECRET
- ✅ REACT_APP_STRIPE_PUBLISHABLE_KEY

---

## STEP 5: Redeploy to Production

Once all variables are added, Vercel needs to rebuild with the new secrets:

1. Go to **Deployments** tab (next to Settings)
2. Find the latest deployment
3. Click the **three dots** (⋯) menu
4. Click **"Redeploy"**
5. Wait for build to complete (usually 2-5 minutes)
6. Check that it shows **"Ready"** (green)

### How to Know If It Succeeded:
- ✅ Build completes without errors
- ✅ Website at https://silentpilot.org loads
- ✅ Features that use API keys work (ChatGPT, etc.)

### If Build Fails:
- Check **Build Logs** for errors
- Verify all variable names are spelled EXACTLY correct
- Make sure values don't have extra spaces
- Check that production environment is selected

---

## STEP 6: Verify Production Uses New Keys

1. Go to https://silentpilot.org
2. Test features that use each API:
   - **Groq:** Test AI chat feature
   - **OpenAI:** Test GPT-powered features
   - **Gemini:** Test Gemini features
   - **Supabase:** Test user login/data
   - **Twitter/Facebook:** Test social sharing
   - **Stripe:** Test (on test mode)

### If Something Doesn't Work:
1. Check browser console for errors (F12 → Console)
2. Verify variable name matches React code
3. Ensure value was copied correctly (no extra spaces)
4. Redeploy again if needed

---

## STEP 7: Delete Old Environment Variables (If Any)

If there are any old variables left from before:
1. Click the **X** button to delete them
2. Redeploy
3. Verify site still works

---

## Local Development Setup

### Create Local .env File
**File:** `~/.../Silent Pilot Website/.env`

```env
# Local development ONLY - NEVER commit to Git
# These are YOUR NEW regenerated keys for testing locally

REACT_APP_SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_NEW_SUPABASE_KEY_HERE
REACT_APP_OPENAI_API_KEY=YOUR_NEW_OPENAI_KEY_HERE
REACT_APP_GEMINI_API_KEY=YOUR_NEW_GEMINI_KEY_HERE
REACT_APP_GROQ_API_KEY=YOUR_NEW_GROQ_KEY_HERE
REACT_APP_DEEPAI_API_KEY=YOUR_DEEPAI_KEY_HERE
REACT_APP_FACEBOOK_APP_SECRET=YOUR_NEW_FACEBOOK_SECRET_HERE
REACT_APP_TWITTER_CLIENT_SECRET=YOUR_NEW_TWITTER_SECRET_HERE
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ShjdCF60t7FOH7Ii37NGt2
```

### ⚠️ CRITICAL:
- **DO NOT** commit .env to Git
- **DO NOT** push to GitHub
- `.env` is in `.gitignore` ✓

### Test Locally
1. Update .env with your new keys
2. Run: `npm run dev` or `npm start`
3. Test features at `http://localhost:3000`
4. Verify all API keys work

---

## Environment Variables vs Secrets

### Environment Variables (What We're Using)
- Visible to frontend (React)
- OK for non-sensitive data
- Prefixed with `REACT_APP_`
- Example: Supabase Anon Key, OpenAI API Key

### Secrets (For Backend Only)
- NOT visible to frontend
- Used for sensitive data
- No `REACT_APP_` prefix
- Example: Supabase Service Role Key (backend only)
- Go to Settings → Integrations if needed

---

## Security Checklist

After setting up environment variables:

- [ ] All 9 variables added to Vercel
- [ ] Production environment selected for each
- [ ] Vercel redeployed successfully
- [ ] silentpilot.org loads without errors
- [ ] All features using APIs work correctly
- [ ] Local .env created with new keys (not in Git)
- [ ] `.gitignore` includes `.env` ✓
- [ ] No `.env` files in Git history ✓
- [ ] Old API keys deleted/regenerated ✓

---

## Troubleshooting

### Website Shows Blank/Error After Redeploy
1. Check build logs for errors
2. Verify variable names (case-sensitive)
3. Check for extra spaces in values
4. Look for typos in keys

### API Calls Failing in Production
1. Verify key is correct (copy-paste again)
2. Check key has necessary permissions
3. Ensure key hasn't expired
4. Regenerate key if needed

### Can't See Environment Variables
1. Make sure you're in Settings tab (not Deployments)
2. Check you're viewing correct project
3. Try refreshing the page

### Local Development Not Working
1. Restart dev server after updating .env
2. Check .env file syntax (no quotes needed)
3. Verify keys are correct
4. Check terminal for error messages

---

## Next Steps After Setup

1. ✅ Add all 9 environment variables to Vercel
2. ✅ Redeploy Vercel
3. ✅ Test production website
4. ✅ Update local .env with new keys
5. ✅ Run full security audit (see SECURITY_CHECKLIST.md)
6. ✅ Set up Supabase RLS (see SUPABASE_SECURITY_SETUP.md)
7. ✅ Monitor for any issues

---

**Status:** Ready to implement
**Last Updated:** 2025-12-24
**Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
