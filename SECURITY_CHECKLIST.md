# 🔐 Silent Pilot Security Overhaul Checklist

## CRITICAL: Keys Exposed in Git History
All API keys below were committed to GitHub public repository. **MUST regenerate immediately.**

---

## 1. REGENERATE API KEYS (DO THIS FIRST!)

### ✅ Groq API Key
**Status:** Already regenerated once, but new key was exposed to Git
**Action Required:** Regenerate again
**Steps:**
1. Go to https://console.groq.com/keys
2. Delete old key: `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`
3. Click "Create New API Key"
4. Copy new key
5. **DO NOT** commit to Git - add only to Vercel

**New Key (Store in 1Password):** [TO BE FILLED]

---

### 🔴 OpenAI API Key
**Status:** EXPOSED - `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`
**Action Required:** REGENERATE IMMEDIATELY
**Steps:**
1. Go to https://platform.openai.com/account/api-keys
2. Click the old key, then "Delete"
3. Click "Create new secret key"
4. Copy new key
5. **DO NOT** commit to Git - add only to Vercel

**New Key (Store in 1Password):** [TO BE FILLED]

---

### 🔴 Google Gemini API Key
**Status:** EXPOSED - `AIzaSyD2kbQzQN8bkE1wKpCjVRl1BXGI0nazZm4`
**Action Required:** REGENERATE IMMEDIATELY
**Steps:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Find and delete the exposed key
3. Click "Create Credentials" → "API Key"
4. Copy new key
5. **DO NOT** commit to Git - add only to Vercel

**New Key (Store in 1Password):** [TO BE FILLED]

---

### 🔴 Supabase Anon Key
**Status:** EXPOSED - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dnFuaGJzbGVjamp3YWt1c3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NjgyNzAsImV4cCI6MjA4MDQ0NDI3MH0.DKzQWavGyLU4cvgq2x3vJpu4oB0vp174G0sAGSJ348E`
**Action Required:** ROTATE KEY (Supabase allows key rotation)
**Steps:**
1. Go to https://app.supabase.com
2. Select project "Silent Pilot Website"
3. Go to Settings → API → Keys and Tokens
4. Under "Anon public" key, click "Rotate"
5. Copy new key
6. **DO NOT** commit to Git - add only to Vercel

**Note:** Old key will stop working after rotation

**New Key (Store in 1Password):** [TO BE FILLED]

---

### 🔴 Twitter/X Client Secret
**Status:** EXPOSED - `BJM8hewb3TcyLAZ_jw6WfF8oG9OkYRriw09dGwtnRc0R_T3pMX`
**Action Required:** REGENERATE IMMEDIATELY
**Steps:**
1. Go to https://developer.twitter.com/en/portal/dashboard
2. Navigate to your app settings
3. Go to "Keys and Tokens" → "API Key and Secret"
4. Click "Regenerate" next to Client Secret
5. Copy new secret
6. **DO NOT** commit to Git - add only to Vercel

**New Key (Store in 1Password):** [TO BE FILLED]

---

### 🔴 Facebook App Secret
**Status:** EXPOSED - `8a4f5161c32389e5eed68dba9efdfae2`
**Action Required:** REGENERATE IMMEDIATELY
**Steps:**
1. Go to https://developers.facebook.com
2. Select your app
3. Go to Settings → Basic
4. Click "Show" next to App Secret
5. Click "Reset App Secret"
6. Confirm and copy new secret
7. **DO NOT** commit to Git - add only to Vercel

**New Key (Store in 1Password):** [TO BE FILLED]

---

### ✅ Stripe Publishable Key
**Status:** TEST KEY ONLY - Lower risk but should still rotate
**Current Key:** `pk_test_51ShjdCF60t7FOH7Ii37NGt2`
**Action:** Keep as-is (test key), but remove from production when ready

---

## 2. SECURE SUPABASE

### Enable Row Level Security (RLS)
**Why:** Prevents unauthorized data access

**Steps:**
1. Go to https://app.supabase.com → Your Project
2. Go to SQL Editor
3. Run this for each table:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enable_read_for_anon" ON table_name
  FOR SELECT USING (true);

CREATE POLICY "enable_write_for_authenticated" ON table_name
  FOR INSERT, UPDATE, DELETE WITH CHECK (auth.role() = 'authenticated');
```

**Tables to Secure:**
- [ ] users
- [ ] subscriptions
- [ ] usage_tracking
- [ ] content_library
- [ ] social_accounts
- [ ] campaigns
- [ ] analytics

### Set API Key Policies
**Steps:**
1. Go to Settings → API → Restrict Signing Up (enable if applicable)
2. Go to Settings → Auth → Providers
3. Review and restrict OAuth providers if needed
4. Enable "Email Verification" for sign-ups

### Enable Audit Logging
**Steps:**
1. Go to Settings → Audit
2. Enable "Audit logging"
3. Review logs weekly for suspicious activity

---

## 3. VERCEL ENVIRONMENT VARIABLES SETUP

### Add Secure Environment Variables
**Steps:**
1. Go to https://vercel.com/dashboard
2. Select "silent-pilot-website" project
3. Go to Settings → Environment Variables
4. For EACH key below, click "Add"
   - **Name:** (use exact name)
   - **Value:** (paste new regenerated key)
   - **Scope:** Production (check this!)

**Variables to Add:**
- [ ] `REACT_APP_SUPABASE_URL` = `https://qzvqnhbslecjjwakusva.supabase.co`
- [ ] `REACT_APP_SUPABASE_ANON_KEY` = [NEW KEY]
- [ ] `REACT_APP_OPENAI_API_KEY` = [NEW KEY]
- [ ] `REACT_APP_GEMINI_API_KEY` = [NEW KEY]
- [ ] `REACT_APP_GROQ_API_KEY` = [NEW KEY]
- [ ] `REACT_APP_DEEPAI_API_KEY` = [CURRENT OR NEW]
- [ ] `REACT_APP_FACEBOOK_APP_SECRET` = [NEW KEY]
- [ ] `REACT_APP_TWITTER_CLIENT_SECRET` = [NEW KEY]
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY` = `pk_test_51ShjdCF60t7FOH7Ii37NGt2`

**⚠️ IMPORTANT:** After adding, redeploy from Vercel:
1. Go to Deployments
2. Click on latest deployment
3. Click "Redeploy" (top right)
4. Wait for build to complete

---

## 4. LOCAL DEVELOPMENT SETUP

### Update Local .env File
**File:** `~/Library/Mobile Documents/com~apple~CloudDocs/Silent Pilot Website/.env`

```env
# Add your NEW regenerated keys here for local testing
# These are NEVER committed to Git
REACT_APP_SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
REACT_APP_SUPABASE_ANON_KEY=YOUR_NEW_KEY_HERE
REACT_APP_OPENAI_API_KEY=YOUR_NEW_KEY_HERE
REACT_APP_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
REACT_APP_GROQ_API_KEY=YOUR_NEW_KEY_HERE
REACT_APP_DEEPAI_API_KEY=YOUR_CURRENT_KEY
REACT_APP_FACEBOOK_APP_SECRET=YOUR_NEW_KEY_HERE
REACT_APP_TWITTER_CLIENT_SECRET=YOUR_NEW_KEY_HERE
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ShjdCF60t7FOH7Ii37NGt2
```

**⚠️ NEVER commit .env to Git - it's in .gitignore**

---

## 5. GITHUB SECURITY VERIFICATION

### ✅ Already Done:
- [x] Removed .env files from Git
- [x] Added .env to .gitignore
- [x] Created .env.example template

### Still Need To:
- [ ] Regenerate all exposed keys (Steps 1 & 2)
- [ ] Add keys to Vercel (Step 3)
- [ ] Redeploy Vercel with new keys
- [ ] Test locally with new keys (Step 4)

### Optional But Recommended:
- [ ] Request GitHub to purge history (if GitHub Enterprise)
- [ ] Set up branch protection rules
- [ ] Enable Dependabot for dependency scanning

---

## 6. ONGOING SECURITY PRACTICES

### ✅ DO:
- ✅ Store all secrets in Vercel environment variables only
- ✅ Use .env.example for reference (no secrets)
- ✅ Rotate keys quarterly
- ✅ Use different keys for dev/prod
- ✅ Enable 2FA on all service accounts
- ✅ Review Supabase audit logs weekly

### ❌ NEVER:
- ❌ Commit .env files to Git
- ❌ Put secrets in comments or code
- ❌ Use same key for multiple services
- ❌ Share API keys in Slack/email
- ❌ Keep old/expired keys around

---

## Timeline

**URGENT (Today):**
- [ ] Regenerate all 6 API keys
- [ ] Add to Vercel environment variables
- [ ] Redeploy Vercel

**This Week:**
- [ ] Secure Supabase (RLS + audit logging)
- [ ] Test locally with new keys
- [ ] Verify production deployment works

**Optional (Next Week):**
- [ ] Request GitHub history purge
- [ ] Set up key rotation schedule
- [ ] Document security procedures

---

## Emergency Contacts

If any key is compromised:
1. **Groq:** Go to console.groq.com and revoke immediately
2. **OpenAI:** Go to platform.openai.com and delete key
3. **Google:** Go to console.cloud.google.com and delete key
4. **Supabase:** Rotate key immediately (Settings → API)
5. **Twitter:** Regenerate at developer.twitter.com
6. **Facebook:** Reset secret at developers.facebook.com

---

**Status:** In Progress - Complete checklist items as you regenerate keys
**Last Updated:** 2025-12-24
