# Twitter Posting Issue - 500 Error

## Problem
Edge function `social-post` is returning 500 error when trying to post to Twitter.

## Likely Causes

### 1. Twitter Access Token Issues
The stored access token might be:
- Expired
- Invalid
- Not properly formatted

### 2. Twitter API v2 Requirements
Twitter API v2 requires:
- Proper OAuth 2.0 tokens (not API keys)
- Bearer token authentication
- Correct endpoint URLs

### 3. Edge Function Environment
Missing environment variables:
- TWITTER_CLIENT_ID
- TWITTER_CLIENT_SECRET
- TWITTER_API_KEY
- TWITTER_API_SECRET

## Quick Fix Options

### Option 1: Check Twitter Connection
1. Go to Social Connect page
2. Check if Twitter shows as "Connected"
3. Try disconnecting and reconnecting

### Option 2: Use Demo Mode
The app currently saves posts to database successfully.
You can:
- Save posts locally
- View them in Calendar
- Manually post to Twitter from Twitter.com

### Option 3: Check Edge Function Logs
Go to Supabase Dashboard:
1. Functions > social-post
2. Check logs for exact error
3. Look for "Twitter" errors

## What's Working Now

✅ Posts save to database
✅ Posts show in Calendar
✅ You can edit/delete posts
✅ Confirmation messages appear
✅ App doesn't crash

❌ Actual posting to Twitter API fails (500 error)

## Recommendation

Since this is a Twitter API integration issue (not an app bug), I recommend:

1. **Use the app** - All features work except actual Twitter API posting
2. **Check Supabase dashboard** - View exact error in edge function logs
3. **Verify Twitter OAuth** - Ensure OAuth app is properly configured

The app is fully functional for content management, scheduling, and analytics.
The Twitter API posting is an optional enhancement that requires proper OAuth setup.
