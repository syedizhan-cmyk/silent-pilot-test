-- ============================================================================
-- FIX REMAINING ISSUES - Apply policies only to tables with user_id
-- ============================================================================

-- Drop all SELECT policies first
DROP POLICY IF EXISTS "Users can view own data" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can view own data" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can view own data" ON public.ai_learning_data;
DROP POLICY IF EXISTS "Users can view own data" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "Users can view own data" ON public.analytics;
DROP POLICY IF EXISTS "Users can view own data" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can view own data" ON public.billing_events;
DROP POLICY IF EXISTS "Users can view own data" ON public.brand_intelligence;
DROP POLICY IF EXISTS "Users can view own data" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can view own data" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view own data" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can view own data" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can view own data" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can view own data" ON public.generated_media;
DROP POLICY IF EXISTS "Users can view own data" ON public.invoices;
DROP POLICY IF EXISTS "Users can view own data" ON public.leads;
DROP POLICY IF EXISTS "Users can view own data" ON public.media_library;
DROP POLICY IF EXISTS "Users can view own data" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can view own data" ON public.posts;
DROP POLICY IF EXISTS "Users can view own data" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can view own data" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can view own data" ON public.social_posts;
DROP POLICY IF EXISTS "Users can view own data" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can view own data" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view own data" ON public.usage_records;
DROP POLICY IF EXISTS "Users can view own data" ON public.website_crawls;
DROP POLICY IF EXISTS "Service role can select" ON public.email_engagement;
DROP POLICY IF EXISTS "Service role can select" ON public.ab_test_variants;
DROP POLICY IF EXISTS "Service role can select" ON public.post_analytics;
DROP POLICY IF EXISTS "Service role can select" ON public.post_performance;
DROP POLICY IF EXISTS "Service role can select" ON public.email_variants;
DROP POLICY IF EXISTS "Everyone can view" ON public.subscription_plans;
DROP POLICY IF EXISTS "Everyone can view" ON public.email_variants;
DROP POLICY IF EXISTS "Everyone can view" ON public.ab_test_variants;
DROP POLICY IF EXISTS "Everyone can view" ON public.post_analytics;
DROP POLICY IF EXISTS "Everyone can view" ON public.post_performance;

-- Drop all INSERT policies
DROP POLICY IF EXISTS "Users can insert" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can insert" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can insert" ON public.ai_learning_data;
DROP POLICY IF EXISTS "Users can insert" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "Users can insert" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can insert" ON public.brand_intelligence;
DROP POLICY IF EXISTS "Users can insert" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can insert" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can insert" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can insert" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can insert" ON public.generated_media;
DROP POLICY IF EXISTS "Users can insert" ON public.leads;
DROP POLICY IF EXISTS "Users can insert" ON public.media_library;
DROP POLICY IF EXISTS "Users can insert" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can insert" ON public.posts;
DROP POLICY IF EXISTS "Users can insert" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can insert" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can insert" ON public.social_posts;
DROP POLICY IF EXISTS "Users can insert" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert" ON public.website_crawls;
DROP POLICY IF EXISTS "Service role can insert" ON public.email_engagement;
DROP POLICY IF EXISTS "Service role can insert" ON public.analytics;
DROP POLICY IF EXISTS "Service role can insert" ON public.billing_events;

-- Drop all UPDATE policies
DROP POLICY IF EXISTS "Users can update" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can update" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can update" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can update" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can update" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can update" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can update" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can update" ON public.leads;
DROP POLICY IF EXISTS "Users can update" ON public.media_library;
DROP POLICY IF EXISTS "Users can update" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can update" ON public.posts;
DROP POLICY IF EXISTS "Users can update" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can update" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can update" ON public.social_posts;
DROP POLICY IF EXISTS "Users can update" ON public.user_preferences;

-- Drop all DELETE policies
DROP POLICY IF EXISTS "Users can delete" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can delete" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can delete" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can delete" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can delete" ON public.generated_media;
DROP POLICY IF EXISTS "Users can delete" ON public.leads;
DROP POLICY IF EXISTS "Users can delete" ON public.media_library;
DROP POLICY IF EXISTS "Users can delete" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can delete" ON public.posts;
DROP POLICY IF EXISTS "Users can delete" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can delete" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can delete" ON public.social_posts;

-- ============================================================================
-- CREATE MINIMAL POLICIES - Only on tables that truly need them
-- Focus on core tables that users interact with directly
-- ============================================================================

-- Core user tables with user_id
CREATE POLICY "enable_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "enable_read" ON public.business_profiles FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.business_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.business_profiles FOR UPDATE USING (user_id = (select auth.uid()));

-- Posts and content
CREATE POLICY "enable_read" ON public.posts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.posts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "enable_delete" ON public.posts FOR DELETE USING (user_id = (select auth.uid()));

-- Social
CREATE POLICY "enable_read" ON public.social_accounts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.social_accounts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.social_accounts FOR UPDATE USING (user_id = (select auth.uid()));

-- Campaigns
CREATE POLICY "enable_read" ON public.campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.campaigns FOR UPDATE USING (user_id = (select auth.uid()));

-- Email
CREATE POLICY "enable_read" ON public.email_campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.email_campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.email_campaigns FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "enable_read" ON public.email_subscribers FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.email_subscribers FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- User data
CREATE POLICY "enable_read" ON public.user_preferences FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.user_preferences FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.user_preferences FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "enable_read" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Billing/Payment
CREATE POLICY "enable_read" ON public.payment_methods FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.payment_methods FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.payment_methods FOR UPDATE USING (user_id = (select auth.uid()));

CREATE POLICY "enable_read" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));

-- Analytics/Leads
CREATE POLICY "enable_read" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_read" ON public.leads FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.leads FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Generated content
CREATE POLICY "enable_read" ON public.generated_media FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.generated_media FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- AI data
CREATE POLICY "enable_read" ON public.ai_generations FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.ai_generations FOR INSERT WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "enable_read" ON public.ai_learning_data FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.ai_learning_data FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Scheduled content
CREATE POLICY "enable_read" ON public.scheduled_content FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "enable_insert" ON public.scheduled_content FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "enable_update" ON public.scheduled_content FOR UPDATE USING (user_id = (select auth.uid()));

-- Public tables (no user_id filter needed)
CREATE POLICY "enable_read_public" ON public.subscription_plans FOR SELECT USING (true);

