# 🔍 Debug Twitter Connection - Step by Step

## We Need To See The Exact Error

Follow these steps carefully:

---

## Step 1: Open Two Terminal Windows

### Terminal 1 - Watch Logs:
```bash
cd ~/Desktop/Silent\ Pilot\ Website
supabase functions logs oauth-exchange --tail
```

**KEEP THIS RUNNING!** Don't close this terminal.

### Terminal 2 - Verify Secrets:
```bash
cd ~/Desktop/Silent\ Pilot\ Website
supabase secrets list
```

You should see your secrets listed.

---

## Step 2: Try Connecting Twitter

1. Go to your browser
2. Dashboard → Social Connect
3. Click "Connect" on Twitter
4. Authorize the app
5. **WATCH THE LOGS in Terminal 1**

---

## Step 3: Share The Error

Copy the error message from Terminal 1 and share it with me!

Common errors you might see:

### Error 1: "TWITTER_CLIENT_ID is undefined"
**Means:** Secrets not deployed
**Fix:** Run the secret commands again

### Error 2: "Twitter token exchange failed: Invalid client credentials"
**Means:** Wrong credentials
**Fix:** Regenerate Twitter credentials

### Error 3: "code_verifier is required"
**Means:** PKCE issue
**Fix:** I'll need to update the code

### Error 4: "Permission denied for relation social_accounts"
**Means:** Database RLS policy issue
**Fix:** Need to check database permissions

### Error 5: "Redirect URI mismatch"
**Means:** URI doesn't match
**Fix:** Update redirect URI

---

## Alternative: Check Supabase Dashboard

If you can't use terminal:

1. Go to: https://supabase.com/dashboard
2. Your project → Edge Functions
3. Click "oauth-exchange"
4. Click "Logs" tab
5. Try connecting Twitter
6. See the error in the logs

---

## Quick Checklist

Before sharing the error, verify:

- [ ] Secrets are deployed (`supabase secrets list` shows them)
- [ ] Edge function is deployed (`supabase functions list` shows it)
- [ ] App is restarted
- [ ] Browser cache is cleared

---

**Run the log command and share what error you see when connecting!** 🔍
