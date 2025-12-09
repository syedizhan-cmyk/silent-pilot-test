# 🔧 Fix Twitter Edge Function Error

## The Error

"Failed to connect account: Edge function returned a non-2xx status code"

This means the edge function (`oauth-exchange`) is being called but failing.

---

## Most Likely Cause: Secrets Not Deployed

The edge function doesn't have access to your Twitter credentials!

### Quick Fix: Deploy Secrets

Run these commands:

```bash
cd ~/Desktop/Silent\ Pilot\ Website

supabase secrets set TWITTER_CLIENT_ID=bi0wUnNDWmdIa1g1ZVdXUDhYbUs6MTpjaQ

supabase secrets set TWITTER_CLIENT_SECRET=BJM8hewb3TcyLAZ_jw6WfF8oG9OkYRriw09dGwtnRc0R_T3pMX
```

Or use the script:
```bash
~/Desktop/deploy_twitter.sh
```

---

## Check Function Logs

To see the exact error:

```bash
supabase functions logs oauth-exchange --tail
```

Then try connecting Twitter again and watch the logs in real-time!

---

## Other Possible Issues

### 1. Code Verifier Missing

Twitter OAuth 2.0 requires PKCE. The code verifier might not be passed correctly.

**Check:** Look for `codeVerifier` in the error logs

### 2. Redirect URI Mismatch

The redirect URI sent to the edge function must match exactly.

**Current:** `http://localhost:3000/oauth/callback`

### 3. Database Permission Error

The edge function might not have permission to insert into `social_accounts` table.

**Fix:** Make sure RLS policies are set up correctly

---

## Debug Steps

### 1. Check if secrets are set:

```bash
supabase secrets list
```

Should show:
- TWITTER_CLIENT_ID
- TWITTER_CLIENT_SECRET
- FACEBOOK_APP_ID
- FACEBOOK_APP_SECRET

### 2. Watch logs in real-time:

```bash
supabase functions logs oauth-exchange --tail
```

### 3. Try connecting Twitter

Go through the OAuth flow and watch the logs for errors.

### 4. Check the error message

The logs will show the exact error from Twitter or Supabase.

---

## Common Error Messages

### "TWITTER_CLIENT_ID is undefined"
**Fix:** Deploy secrets (commands above)

### "Invalid code_verifier"
**Issue:** PKCE code verifier problem
**Fix:** Check that code verifier is being generated and passed

### "Redirect URI mismatch"
**Fix:** Make sure all URIs match exactly

### "Permission denied for table social_accounts"
**Fix:** Check database RLS policies

---

## Quick Solution

Most likely you just need to deploy the secrets:

```bash
cd ~/Desktop/Silent\ Pilot\ Website

# Deploy secrets
supabase secrets set TWITTER_CLIENT_ID=bi0wUnNDWmdIa1g1ZVdXUDhYbUs6MTpjaQ
supabase secrets set TWITTER_CLIENT_SECRET=BJM8hewb3TcyLAZ_jw6WfF8oG9OkYRriw09dGwtnRc0R_T3pMX

# Verify
supabase secrets list

# Try connecting again!
```

---

**Deploy the secrets and try again!** Let me know what the function logs show! 🔍
