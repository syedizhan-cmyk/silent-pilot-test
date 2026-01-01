# Social Media Integration - Deployment Checklist

## 📋 Pre-Deployment Checklist

### Development Environment
- [ ] Verified all files with `./verify-social-setup.sh`
- [ ] Tested demo mode locally (`npm start`)
- [ ] Confirmed build succeeds (`npm run build`)
- [ ] Reviewed all documentation files

### Edge Functions Preparation
- [ ] All 8 OAuth functions created:
  - [ ] twitter-auth
  - [ ] facebook-auth
  - [ ] instagram-auth
  - [ ] linkedin-auth
  - [ ] tiktok-auth
  - [ ] youtube-auth
  - [ ] oauth-callback
  - [ ] oauth-exchange

## 🚀 Deployment Steps

### Phase 1: Deploy to Staging/Development

#### 1. Deploy Edge Functions to Supabase
```bash
cd silent-pilot

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all OAuth functions
supabase functions deploy twitter-auth
supabase functions deploy facebook-auth
supabase functions deploy instagram-auth
supabase functions deploy linkedin-auth
supabase functions deploy tiktok-auth
supabase functions deploy youtube-auth
supabase functions deploy oauth-callback
supabase functions deploy oauth-exchange

# Verify deployment
supabase functions list
```

#### 2. Configure Minimal Secrets (For Testing)
```bash
# Required for demo mode to work
supabase secrets set APP_URL=https://your-dev-app.com
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### 3. Deploy Frontend
```bash
# Build
npm run build

# Deploy to Vercel/Netlify
vercel deploy
# or
netlify deploy

# Configure environment variables in hosting platform:
# - REACT_APP_SUPABASE_URL
# - REACT_APP_SUPABASE_ANON_KEY
```

#### 4. Test Demo Mode
- [ ] Navigate to Social Accounts page
- [ ] Click "Connect" on any platform
- [ ] Verify demo connection is created
- [ ] Test posting (should simulate)
- [ ] Verify no errors in console

### Phase 2: Enable Production OAuth (Optional)

#### Choose Platform(s) to Enable

Start with Twitter (easiest):

#### 5. Register OAuth App (Twitter Example)
- [ ] Go to https://developer.twitter.com/en/portal/dashboard
- [ ] Create project and app
- [ ] Enable OAuth 2.0
- [ ] Set Callback URL: `https://YOUR_PROJECT.functions.supabase.co/oauth-callback`
- [ ] Copy Client ID and Client Secret
- [ ] Note down scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`

#### 6. Configure Frontend Environment
```bash
# Add to Vercel/Netlify environment variables
REACT_APP_TWITTER_CLIENT_ID=your_twitter_client_id
```

Redeploy frontend to apply environment variables.

#### 7. Configure Supabase Secrets
```bash
supabase secrets set TWITTER_CLIENT_ID=your_client_id
supabase secrets set TWITTER_CLIENT_SECRET=your_client_secret
supabase secrets set TWITTER_REDIRECT_URI=https://YOUR_PROJECT.functions.supabase.co/oauth-callback
```

#### 8. Test Production OAuth
- [ ] Clear browser cache
- [ ] Navigate to Social Accounts
- [ ] Click "Connect Twitter"
- [ ] Should redirect to Twitter OAuth (not demo mode)
- [ ] Authorize the app
- [ ] Should redirect back to your app
- [ ] Verify account appears in "Connected Accounts"
- [ ] Test creating and posting content
- [ ] Verify post appears on Twitter

#### 9. Repeat for Additional Platforms
Repeat steps 5-8 for each platform you want to enable.

### Phase 3: Production Deployment

#### 10. Production Environment Variables
```bash
# Frontend (Vercel/Netlify)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key

# For each platform you're enabling:
REACT_APP_TWITTER_CLIENT_ID=prod_twitter_id
REACT_APP_FACEBOOK_APP_ID=prod_facebook_id
REACT_APP_LINKEDIN_CLIENT_ID=prod_linkedin_id
REACT_APP_TIKTOK_CLIENT_KEY=prod_tiktok_key
REACT_APP_GOOGLE_CLIENT_ID=prod_google_id
```

#### 11. Production Supabase Secrets
```bash
# Global
supabase secrets set APP_URL=https://your-production-app.com
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Per Platform (as needed)
supabase secrets set TWITTER_CLIENT_ID=xxx
supabase secrets set TWITTER_CLIENT_SECRET=xxx
supabase secrets set TWITTER_REDIRECT_URI=https://xxx.functions.supabase.co/oauth-callback

# Repeat for each platform
```

#### 12. Update OAuth App Settings
For each platform's developer portal:
- [ ] Update Redirect URI to production Edge Function URL
- [ ] Add production app URL to allowed domains
- [ ] Verify scopes are correct
- [ ] Test OAuth flow in production

#### 13. Final Production Tests
- [ ] Test demo mode still works (for unconfigured platforms)
- [ ] Test OAuth flow for each configured platform
- [ ] Test posting to each platform
- [ ] Test disconnecting accounts
- [ ] Test reconnecting accounts
- [ ] Monitor Edge Function logs for errors
- [ ] Check database for proper token storage

## 🔍 Post-Deployment Monitoring

### Week 1
- [ ] Monitor Edge Function logs daily
- [ ] Check for OAuth errors
- [ ] Track connection success rate
- [ ] Monitor platform API errors
- [ ] Collect user feedback

### Ongoing
- [ ] Weekly review of Edge Function logs
- [ ] Monitor token refresh failures
- [ ] Track platform API rate limits
- [ ] Update documentation as needed
- [ ] Test OAuth flows after platform API updates

## 🐛 Troubleshooting Deployment

### Edge Functions Not Working
```bash
# Check deployment status
supabase functions list

# View logs
supabase functions logs twitter-auth --tail
supabase functions logs oauth-exchange --tail

# Check secrets
supabase secrets list
```

### OAuth Redirect Fails
1. Verify redirect URI in platform settings matches exactly
2. Check Edge Function URL is correct
3. Verify secrets are set correctly
4. Check Edge Function logs for errors

### Frontend Not Detecting OAuth Config
1. Verify environment variables are set in hosting platform
2. Redeploy frontend after env var changes
3. Clear browser cache and hard refresh
4. Check browser console for errors

### Tokens Not Saving
1. Check database permissions (RLS policies)
2. Verify service role key is correct
3. Check oauth-exchange function logs
4. Ensure social_accounts table exists

## 📊 Success Metrics

After deployment, you should see:
- ✅ 0 errors in Edge Function logs
- ✅ Successful OAuth redirects
- ✅ Accounts saving to database
- ✅ Posts successfully sent to platforms
- ✅ Demo mode works for unconfigured platforms
- ✅ Production mode works for configured platforms

## 🎯 Launch Criteria

### Minimum Viable Launch
- [ ] Demo mode works perfectly
- [ ] At least 1 platform OAuth enabled (recommend Twitter)
- [ ] Documentation accessible to users
- [ ] No critical errors
- [ ] Basic posting functionality works

### Full Launch
- [ ] All 6 platforms OAuth enabled
- [ ] Comprehensive testing completed
- [ ] Documentation complete
- [ ] User onboarding flow tested
- [ ] Support processes in place
- [ ] Monitoring and alerts configured

## 📝 Rollback Plan

If issues occur:

### Quick Rollback
```bash
# Revert frontend
vercel rollback
# or
netlify rollback

# Disable OAuth temporarily
# Remove REACT_APP_*_CLIENT_ID from env vars
```

### Full Rollback
```bash
# Undeploy specific function if needed
supabase functions delete problematic-function

# Or disable OAuth by removing secrets
supabase secrets unset TWITTER_CLIENT_ID
supabase secrets unset TWITTER_CLIENT_SECRET

# App will fall back to demo mode
```

## 🎉 Deployment Complete Checklist

- [ ] All Edge Functions deployed
- [ ] Frontend deployed
- [ ] Environment variables configured
- [ ] Secrets configured in Supabase
- [ ] Demo mode tested
- [ ] At least one OAuth platform tested
- [ ] Documentation reviewed
- [ ] Monitoring in place
- [ ] Team trained on support
- [ ] Rollback plan understood

---

**Ready to Deploy?** Start with Phase 1 (Demo Mode) and gradually enable OAuth platforms as needed!
