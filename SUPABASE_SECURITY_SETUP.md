# 🔐 Supabase Security Setup Guide

## Project Details
- **Project Name:** Silent Pilot Website
- **Project URL:** https://qzvqnhbslecjjwakusva.supabase.co
- **Region:** [Check in Supabase console]

---

## STEP 1: Access Supabase Dashboard

1. Go to https://app.supabase.com
2. Log in with your account
3. Click on "Silent Pilot Website" project
4. You should see the main dashboard

---

## STEP 2: Enable Row Level Security (RLS) - CRITICAL

### What is RLS?
RLS ensures only authorized users can access their own data. Without it, anyone with your Anon Key can read/write all data.

### How to Enable RLS for Each Table

#### Authentication Table
```sql
-- Step 1: Go to SQL Editor in Supabase
-- Step 2: Paste and run this:

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Step 3: If you have a public users table, secure it:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);
```

#### Subscriptions Table
```sql
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" 
  ON public.subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Only service role can insert subscriptions" 
  ON public.subscriptions FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
```

#### Usage Tracking Table
```sql
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage" 
  ON public.usage_tracking FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert usage data" 
  ON public.usage_tracking FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
```

#### Content Library Table
```sql
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own content" 
  ON public.content_library FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create content" 
  ON public.content_library FOR INSERT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can update own content" 
  ON public.content_library FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own content" 
  ON public.content_library FOR DELETE 
  USING (auth.uid() = created_by);
```

#### Social Accounts Table
```sql
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social accounts" 
  ON public.social_accounts FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create social accounts" 
  ON public.social_accounts FOR INSERT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts" 
  ON public.social_accounts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts" 
  ON public.social_accounts FOR DELETE 
  USING (auth.uid() = user_id);
```

#### Campaigns Table
```sql
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns" 
  ON public.campaigns FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create campaigns" 
  ON public.campaigns FOR INSERT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can update own campaigns" 
  ON public.campaigns FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own campaigns" 
  ON public.campaigns FOR DELETE 
  USING (auth.uid() = created_by);
```

#### Analytics Table
```sql
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" 
  ON public.analytics FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert analytics" 
  ON public.analytics FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');
```

---

## STEP 3: Verify RLS is Enabled

1. Go to **Authentication** → **Policies** in Supabase
2. You should see all your tables listed with policies
3. Each table should have green checkmarks indicating RLS is enabled

---

## STEP 4: Configure Authentication

### Enable Email Verification
1. Go to **Authentication** → **Policies**
2. Click on **Email**
3. Toggle **"Confirm email"** to ON
4. Save

### Configure Social Logins (If Using)
1. Go to **Authentication** → **Providers**
2. For each provider (Google, GitHub, etc.):
   - Enable the provider
   - Add credentials from that service
   - Set redirect URLs (usually: `https://silentpilot.org/auth/callback`)

### Set Session Duration
1. Go to **Authentication** → **Policies**
2. Find **JWT expiry** settings
3. Set to 1 hour (for security)
4. Save

---

## STEP 5: Enable Audit Logging

### View Audit Logs
1. Go to **Settings** → **Audit**
2. Click **Enable Audit Logging** (if not already enabled)

### Review Logs Regularly
1. Go to **Settings** → **Audit** → **Logs**
2. Check for:
   - Unusual login attempts
   - Mass deletions
   - Permission changes
   - API key usage

---

## STEP 6: API Key Management

### Rotate Anon Key (Already Exposed)
**⚠️ CRITICAL: This key was in GitHub. Must rotate now.**

1. Go to **Settings** → **API**
2. Find **Anon public** key section
3. Click **Rotate**
4. Confirm the rotation
5. Copy the new key
6. Add to Vercel environment variables (see SECURITY_CHECKLIST.md)
7. Redeploy Vercel

### Manage Service Role Key
**⚠️ WARNING: This key has full database access. Never expose it.**

1. Go to **Settings** → **API**
2. Find **Service role secret** 
3. Store securely (only in backend, never in frontend)
4. Add to Vercel **as a secret** (not exposed to browser)

---

## STEP 7: Storage Security (If Using Supabase Storage)

### Enable Storage Policies
```sql
-- Secure user profile uploads
CREATE POLICY "Users can upload own profile picture"
  ON storage.objects FOR INSERT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Secure content uploads
CREATE POLICY "Users can upload content"
  ON storage.objects FOR INSERT
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Restrict Storage Access
1. Go to **Storage** in Supabase
2. For each bucket:
   - Make it **Private** (not public)
   - Set policies to restrict access
   - Generate signed URLs for temporary access

---

## STEP 8: Backup & Recovery

### Enable Automated Backups
1. Go to **Settings** → **Backups**
2. Click **Enable Daily Backups**
3. Set backup frequency to Daily
4. Keep 7-30 days of backups

### Test Recovery Process
1. Go to **Settings** → **Backups**
2. Select a backup
3. Click **Test Restore** (this creates a test database)
4. Verify data integrity
5. Delete test database

---

## STEP 9: Monitor Database Performance

### Check Query Performance
1. Go to **Analytics** or **Logs**
2. Look for slow queries
3. Identify any long-running operations
4. Add indexes if needed

### Monitor Usage
1. Go to **Settings** → **Database Usage**
2. Check:
   - Database size
   - Row count
   - Connections
   - Real-time subscriptions

---

## STEP 10: Security Headers

### Enable CORS Restrictions
1. Go to **Settings** → **API**
2. Under **CORS settings**, add allowed origins:
   - `https://silentpilot.org`
   - `https://*.silentpilot.org`
   - `http://localhost:3000` (dev only)

### Add Security Headers
Contact Supabase support or add via middleware:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Checklist

- [ ] **RLS Enabled** on all tables
- [ ] **Email verification** enabled
- [ ] **Session duration** set to 1 hour
- [ ] **Audit logging** enabled
- [ ] **Anon key rotated** (was exposed in Git)
- [ ] **New key added to Vercel**
- [ ] **Vercel redeployed**
- [ ] **Backups enabled** (daily)
- [ ] **CORS configured** for production domain
- [ ] **Storage policies** set (if using Storage)
- [ ] **Performance monitored** (check slow queries)

---

## Testing

### Test RLS is Working
1. Create two user accounts (different emails)
2. Log in as User A
3. Try to view/edit User B's data
4. Should get a permission denied error ✓

### Test Auth Works
1. Logout
2. Verify redirect to login
3. Test "Forgot Password"
4. Test email verification

### Test API Keys
1. Update .env with new Anon key
2. Run local development server
3. Try to:
   - Sign up new user
   - Create a record
   - Update own data
   - View own data
4. Should all work ✓

---

## Troubleshooting

### Users Can't Sign Up
- Check email verification is enabled
- Check CORS settings include your domain
- Check auth.users table has RLS policies

### Users See 403 Forbidden
- RLS policies may be too restrictive
- Check if user_id matches auth.uid()
- Verify JWT token is valid

### Database Performance Issues
- Check for missing indexes
- Review slow query logs
- Consider archiving old data

### Lost Access to Tables
- Check RLS policies aren't blocking service role
- Service role should have no restrictions
- Contact Supabase support if needed

---

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Community Help:** https://github.com/supabase/supabase/discussions
- **Report Issues:** https://github.com/supabase/supabase/issues

---

**Status:** Ready to implement
**Last Updated:** 2025-12-24
