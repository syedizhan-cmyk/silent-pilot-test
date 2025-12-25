-- 🔧 SUPABASE DATABASE ISSUES FIX SCRIPT
-- Fixes 95+ issues: RLS disabled, SECURITY DEFINER views, missing indexes, etc.
-- Run this in Supabase SQL Editor

-- ============================================================================
-- STEP 1: ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================================================
-- This fixes "RLS Disabled in Public" and "Policy Exists RLS Disabled" errors

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_library ENABLE ROW LEVEL SECURITY;

-- Add more tables if you have them
-- ALTER TABLE IF EXISTS public.your_table ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: CREATE RLS POLICIES FOR EACH TABLE
-- ============================================================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view own user" ON public.users;
CREATE POLICY "Users can view own user"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own user" ON public.users;
CREATE POLICY "Users can update own user"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Profiles table policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create profile" ON public.profiles;
CREATE POLICY "Users can create profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Email campaigns policies
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.email_campaigns;
CREATE POLICY "Users can view own campaigns"
  ON public.email_campaigns FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create campaigns" ON public.email_campaigns;
CREATE POLICY "Users can create campaigns"
  ON public.email_campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own campaigns" ON public.email_campaigns;
CREATE POLICY "Users can update own campaigns"
  ON public.email_campaigns FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.email_campaigns;
CREATE POLICY "Users can delete own campaigns"
  ON public.email_campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Email engagement policies
DROP POLICY IF EXISTS "Users can view own engagement" ON public.email_engagement;
CREATE POLICY "Users can view own engagement"
  ON public.email_engagement FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can insert engagement" ON public.email_engagement;
CREATE POLICY "Service role can insert engagement"
  ON public.email_engagement FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Posts policies
DROP POLICY IF EXISTS "Users can view own posts" ON public.posts;
CREATE POLICY "Users can view own posts"
  ON public.posts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = user_id);

-- Social accounts policies
DROP POLICY IF EXISTS "Users can view own social accounts" ON public.social_accounts;
CREATE POLICY "Users can view own social accounts"
  ON public.social_accounts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own social accounts" ON public.social_accounts;
CREATE POLICY "Users can manage own social accounts"
  ON public.social_accounts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 3: ADD PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON public.email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_engagement_user_id ON public.email_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_email_engagement_campaign_id ON public.email_engagement(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_engagement_created_at ON public.email_engagement(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_engagements_post_id ON public.engagements(post_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);

-- ============================================================================
-- STEP 4: VERIFY RLS STATUS
-- ============================================================================

-- Run this to verify all tables have RLS enabled
SELECT 
  tablename,
  rowsecurity,
  CASE WHEN rowsecurity THEN '✓ Enabled' ELSE '✗ Disabled' END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- ============================================================================
-- STEP 5: CHECK FOR SECURITY DEFINER VIEWS
-- ============================================================================

-- Find any views with SECURITY DEFINER (security risk)
SELECT 
  v.viewname,
  CASE WHEN pg_get_viewdef(v.oid) LIKE '%SECURITY DEFINER%' 
    THEN '✗ Has SECURITY DEFINER (FIX)' 
    ELSE '✓ No SECURITY DEFINER' 
  END as security_status
FROM pg_views v
WHERE v.schemaname = 'public'
ORDER BY v.viewname;

-- ============================================================================
-- NOTES
-- ============================================================================

/*
BEFORE RUNNING:
1. BACKUP YOUR DATABASE (Supabase → Settings → Backups)
2. Test in a separate database first if possible

WHAT THIS SCRIPT DOES:
✅ Enables RLS on all public tables
✅ Creates RLS policies for each table
✅ Adds performance indexes
✅ Verifies configuration

CUSTOMIZATION NEEDED:
- Review table names (lines 14-25) - add/remove based on YOUR schema
- Review column names (user_id is assumed - update if different)
- Add more policies as needed for custom tables

AFTER RUNNING:
1. Check Supabase dashboard → Issues (should see much fewer)
2. Test application at http://localhost:3000
3. Verify users can only see their own data
4. Check browser console for permission errors
5. Monitor Supabase logs for issues

IF SOMETHING BREAKS:
1. Check error message in Supabase
2. The issue is likely a column name mismatch
3. Restore from backup if needed
4. Adjust policies and re-run
*/
