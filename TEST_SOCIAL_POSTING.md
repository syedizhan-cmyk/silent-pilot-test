# 🧪 Testing Social Media Posting

A comprehensive guide to test your social media integration safely.

## Pre-Testing Checklist

Before you start testing:

- [ ] OAuth credentials configured for at least one platform
- [ ] Edge functions deployed to Supabase
- [ ] Database schema applied
- [ ] Development server running
- [ ] Test social media accounts ready (don't use your main accounts!)

---

## Test 1: OAuth Connection Flow

### Objective
Verify that OAuth authentication works correctly.

### Steps

1. Navigate to `/dashboard/social-connect`
2. Click "Connect" on Facebook (or your configured platform)
3. Observe the redirect to the platform's OAuth page
4. Grant permissions
5. Observe redirect back to your app

### Expected Results

✅ Redirected to platform's OAuth page
✅ Permission screen shows your app name
✅ Redirected back to `/dashboard/social-connect?success=true&platform=facebook`
✅ Success banner appears
✅ Account appears in "Connected Accounts" section
✅ Account shows connection date
✅ "Disconnect" button is visible

### Troubleshooting

❌ **Stuck on "Connecting your account..."**
- Check browser console for errors
- Verify edge function is deployed: `supabase functions logs oauth-exchange`
- Check redirect URI matches OAuth app settings

❌ **"Invalid redirect URI" error**
- Verify exact match in OAuth app settings
- Check for typos in `.env` REACT_APP_REDIRECT_URI

---

## Test 2: Demo Mode Detection

### Objective
Verify system correctly detects when OAuth is not configured.

### Steps

1. Remove OAuth credentials from `.env` (or comment them out)
2. Restart development server
3. Navigate to `/dashboard/social-connect`
4. Click "Connect" on any platform

### Expected Results

✅ No redirect to OAuth page
✅ Account connects immediately
✅ Shows "Demo Mode" message
✅ Alert mentions adding credentials to .env file
✅ Account has "demo_token_" prefix in access token

### Restore After Test

Uncomment OAuth credentials and restart server.

---

## Test 3: Simple Text Post

### Objective
Post plain text content to connected platform.

### Steps

1. Ensure you have a connected account (not demo)
2. Go to "Create Content" or "Calendar"
3. Write a simple test message: "Testing Silent Pilot integration 🚀"
4. Select your connected account
5. Click "Publish Now"

### Expected Results

✅ Success message appears
✅ Post appears on the social media platform
✅ Post content matches what you entered
✅ Post is visible on your timeline/page

### Facebook-Specific

For Facebook, verify:
- Post appears on your Facebook Page (not personal timeline)
- If "No Facebook pages found" error: Create a page first

### Twitter-Specific

For Twitter, verify:
- Tweet appears in your profile
- Character count respected
- No truncation

---

## Test 4: Post with Image

### Objective
Post content with an image URL.

### Steps

1. Find a publicly accessible image URL (e.g., from Unsplash)
   - Example: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4`
2. Create post with text + image URL
3. Publish to connected account

### Expected Results

✅ Post created successfully
✅ Image appears in the post
✅ Text caption included

### Platform Notes

**Facebook**: Image automatically fetched and attached
**Instagram**: Requires direct image URL, JPEG/PNG format
**Twitter**: Media upload implementation pending (current version)
**LinkedIn**: Image support varies by API version

---

## Test 5: Multi-Platform Post

### Objective
Post same content to multiple platforms simultaneously.

### Steps

1. Connect at least 2 different platforms (e.g., Facebook + Twitter)
2. Create a post
3. Select both accounts in the platform selector
4. Click "Publish Now"

### Expected Results

✅ Post appears on both platforms
✅ Content identical on both (where applicable)
✅ Success messages for each platform
✅ Both posts logged in database

---

## Test 6: Scheduled Post

### Objective
Schedule a post for future publication.

### Steps

1. Create a post
2. Select a connected account
3. Choose "Schedule" instead of "Publish Now"
4. Set time to 5 minutes in the future
5. Save

### Expected Results

✅ Post saved with status "scheduled"
✅ Post appears in calendar view
✅ Scheduled time displayed correctly

### Manual Publish Test

Since automated scheduling requires cron setup:

1. Wait until scheduled time passes
2. Manually check database:
   ```sql
   SELECT * FROM social_posts 
   WHERE status = 'scheduled' 
   AND scheduled_for <= NOW();
   ```
3. Manually trigger publish (or set up cron)

---

## Test 7: Token Validation

### Objective
Verify token validation works correctly.

### Steps

1. Connect an account
2. Use browser dev tools → Application → Storage
3. Go to Supabase database
4. Manually expire the token:
   ```sql
   UPDATE social_accounts 
   SET expires_at = NOW() - INTERVAL '1 day'
   WHERE id = 'your-account-id';
   ```
5. Try to post

### Expected Results

✅ System detects expired token
✅ Automatically attempts token refresh
✅ If refresh fails, shows "Please reconnect" message
✅ Post succeeds after valid token obtained

---

## Test 8: Account Disconnection

### Objective
Verify accounts can be disconnected properly.

### Steps

1. Connect an account
2. Click "Disconnect" button
3. Confirm disconnection
4. Check that account is removed

### Expected Results

✅ Confirmation dialog appears
✅ Account removed from "Connected Accounts"
✅ Account marked inactive in database (not deleted)
✅ Can reconnect same account later

---

## Test 9: Error Handling

### Objective
Verify graceful error handling.

### Test 9a: Invalid Token

1. Manually invalidate token in database
2. Remove refresh_token
3. Try to post

**Expected**: Clear error message, prompt to reconnect

### Test 9b: Network Error

1. Disconnect internet (or block requests in dev tools)
2. Try to post

**Expected**: Network error message, retry option

### Test 9c: Platform API Error

This requires platform-specific testing (e.g., exceeding rate limits).

**Expected**: Specific error from platform displayed to user

---

## Test 10: Demo Mode Posting

### Objective
Verify demo mode correctly simulates posting.

### Steps

1. Ensure no OAuth credentials configured (demo mode active)
2. Connect a demo account
3. Create and "publish" a post

### Expected Results

✅ Post "succeeds" immediately
✅ Shows "Demo Mode" indicator
✅ Post logged in database with demo flag
✅ No actual API call to social platform
✅ Console shows demo mode log message

---

## Monitoring During Tests

### Check Browser Console

Look for:
- OAuth flow logs
- API call logs
- Error messages
- Demo mode indicators

### Check Supabase Logs

```bash
# OAuth exchange logs
supabase functions logs oauth-exchange

# Social posting logs
supabase functions logs social-post

# Token refresh logs
supabase functions logs oauth-refresh
```

### Check Database

```sql
-- View all connected accounts
SELECT * FROM social_accounts WHERE is_active = true;

-- View all posts
SELECT * FROM social_posts ORDER BY created_at DESC;

-- View post analytics (if available)
SELECT * FROM post_analytics;

-- Check for errors
SELECT * FROM social_posts WHERE status = 'failed';
```

---

## Performance Testing

### Test with Multiple Accounts

1. Connect 3-5 accounts across different platforms
2. Create a post and publish to all
3. Measure time to completion

**Expected**: All posts complete within 10 seconds

### Test Rate Limiting

1. Create 10 posts in rapid succession
2. Publish all to same account

**Expected**: 
- Platform rate limits respected
- Appropriate delays between posts
- Error messages if rate limit exceeded

---

## Security Testing

### Test CSRF Protection

1. Start OAuth flow
2. Manually modify state parameter in URL
3. Complete OAuth

**Expected**: State mismatch error, connection fails

### Test Token Exposure

1. Inspect network requests in browser dev tools
2. Check for tokens in URLs or responses

**Expected**: 
- No access tokens in frontend code
- Tokens only in secure edge function calls
- Client secrets never exposed

---

## Platform-Specific Tests

### Facebook

- [ ] Post to Page (not personal profile)
- [ ] Post with link preview
- [ ] Post with image
- [ ] Verify post appears publicly
- [ ] Check Facebook Page Insights

### Instagram

- [ ] Requires business account
- [ ] Requires linked Facebook Page
- [ ] Image required for posts
- [ ] Caption under 2200 characters
- [ ] Check post in Instagram app

### Twitter/X

- [ ] Tweet under 280 characters
- [ ] Longer tweets truncated with warning
- [ ] Links counted correctly
- [ ] Tweet appears in profile

### LinkedIn

- [ ] Post to personal profile
- [ ] Post visible to network
- [ ] Links work correctly
- [ ] Professional formatting maintained

---

## Automated Testing Script

Create `test-social-posting.js`:

```javascript
// Run with: node test-social-posting.js

const testCases = [
  'OAuth Connection',
  'Text Post',
  'Image Post',
  'Multi-Platform',
  'Demo Mode',
  'Disconnection'
];

console.log('🧪 Social Media Integration Test Suite\n');

testCases.forEach((test, i) => {
  console.log(`${i + 1}. ${test}: ⏳ Pending manual verification`);
});

console.log('\n✨ Run each test manually and mark as complete');
```

---

## Test Results Template

Use this to track your testing:

```
# Test Results - [Date]

## Platform: Facebook
- [ ] OAuth Connection: PASS/FAIL
- [ ] Text Post: PASS/FAIL
- [ ] Image Post: PASS/FAIL
- [ ] Notes: ___________

## Platform: Twitter
- [ ] OAuth Connection: PASS/FAIL
- [ ] Text Post: PASS/FAIL
- [ ] Notes: ___________

## Platform: LinkedIn
- [ ] OAuth Connection: PASS/FAIL
- [ ] Text Post: PASS/FAIL
- [ ] Notes: ___________

## Issues Found
1. ___________
2. ___________

## Next Steps
- ___________
```

---

## ✅ Test Complete Checklist

All tests passing? Great! You're ready for:

- [ ] Production OAuth apps (vs development)
- [ ] Production deployment
- [ ] Real user accounts
- [ ] Analytics tracking
- [ ] Scheduled posting automation

---

**Happy Testing!** 🧪✨

Remember: Always test with non-production accounts first!
