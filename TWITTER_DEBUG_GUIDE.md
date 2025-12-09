# 🔍 Twitter OAuth Debug Guide

## The Issue

"Authorization code was invalid" error from Twitter.

Possible causes:
1. Code verifier not being stored
2. Code verifier not being retrieved  
3. Code verifier not matching
4. Redirect URI mismatch
5. Authorization code being used twice

---

## Debug Steps

### Step 1: Check Browser Console

1. **Restart your app:**
   ```bash
   cd ~/Desktop/Silent\ Pilot\ Website
   npm start
   ```

2. **Open browser console:**
   - Press `F12`
   - Go to "Console" tab
   - Clear existing messages

3. **Try connecting Twitter**

4. **Look for these log messages:**
   ```
   Twitter: Stored code verifier: [long string]
   OAuth callback - Platform: twitter
   OAuth callback - Code: present
   OAuth callback - Code verifier: present
   OAuth callback - Redirect URI: http://localhost:3000/oauth/callback
   ```

### Step 2: Share The Logs

Copy all the console messages and share them!

---

## What To Look For

### If you see "Code verifier: missing"
**Problem:** Code verifier not being retrieved from sessionStorage
**Possible fix:** Browser clearing sessionStorage between pages

### If you see "Code verifier: present" but still fails
**Problem:** Code verifier doesn't match what Twitter expects
**Possible fix:** Check PKCE implementation in edge function

### If redirect URI looks wrong
**Problem:** Mismatch between what we're sending and what Twitter expects
**Fix:** Need to update redirect URI

---

## Alternative: Try Without PKCE

If the code verifier is causing issues, we could try Twitter's OAuth 1.0a instead of OAuth 2.0, or see if Twitter accepts OAuth 2.0 without PKCE (some platforms do).

---

## Edge Function Check

The edge function expects:
- `platform`: "twitter"
- `code`: Authorization code from Twitter
- `userId`: Your user ID
- `redirectUri`: Must match exactly
- `codeVerifier`: The PKCE verifier

If any of these are wrong, it will fail.

---

**Restart app, check console logs, and share what you see!** 🔍
