-- ============================================================================
-- FINAL CLEANUP - FIXED (Correct INSERT syntax)
-- ============================================================================

-- Drop all remaining generic policies
DROP POLICY IF EXISTS "auth_users" ON public.ab_tests;
DROP POLICY IF EXISTS "auth_users" ON public.ai_generations;
DROP POLICY IF EXISTS "auth_users" ON public.ai_learning_data;
DROP POLICY IF EXISTS "auth_users" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "auth_users" ON public.autopilot_settings;
DROP POLICY IF EXISTS "auth_users" ON public.brand_intelligence;
DROP POLICY IF EXISTS "auth_users" ON public.business_profiles;
DROP POLICY IF EXISTS "auth_users" ON public.campaigns;
DROP POLICY IF EXISTS "auth_users" ON public.content_ideas;
DROP POLICY IF EXISTS "auth_users" ON public.email_campaigns;
DROP POLICY IF EXISTS "auth_users" ON public.email_subscribers;
DROP POLICY IF EXISTS "auth_users" ON public.generated_media;
DROP POLICY IF EXISTS "auth_users" ON public.leads;
DROP POLICY IF EXISTS "auth_users" ON public.media_library;
DROP POLICY IF EXISTS "auth_users" ON public.payment_methods;
DROP POLICY IF EXISTS "auth_users" ON public.posts;
DROP POLICY IF EXISTS "auth_users" ON public.scheduled_content;
DROP POLICY IF EXISTS "auth_users" ON public.social_accounts;
DROP POLICY IF EXISTS "auth_users" ON public.social_posts;
DROP POLICY IF EXISTS "auth_users" ON public.user_preferences;
DROP POLICY IF EXISTS "auth_read" ON public.analytics;
DROP POLICY IF EXISTS "auth_read" ON public.invoices;
DROP POLICY IF EXISTS "auth_read" ON public.user_subscriptions;
DROP POLICY IF EXISTS "auth_read" ON public.usage_records;
DROP POLICY IF EXISTS "auth_read" ON public.billing_events;
DROP POLICY IF EXISTS "service_role" ON public.analytics;
DROP POLICY IF EXISTS "service_role" ON public.usage_records;
DROP POLICY IF EXISTS "service_role" ON public.billing_events;
DROP POLICY IF EXISTS "public_read" ON public.subscription_plans;
DROP POLICY IF EXISTS "public_read" ON public.ab_test_variants;
DROP POLICY IF EXISTS "public_read" ON public.email_variants;
DROP POLICY IF EXISTS "public_read" ON public.post_analytics;
DROP POLICY IF EXISTS "public_read" ON public.post_performance;
DROP POLICY IF EXISTS "public_read" ON public.email_engagement;
DROP POLICY IF EXISTS "public_read" ON public.profiles;
DROP POLICY IF EXISTS "service_insert" ON public.email_engagement;

-- ============================================================================
-- CREATE OPTIMIZED POLICIES - Separate for SELECT, INSERT, UPDATE, DELETE
-- ============================================================================

-- ab_tests
CREATE POLICY "select_own" ON public.ab_tests FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.ab_tests FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.ab_tests FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.ab_tests FOR DELETE USING (user_id = (select auth.uid()));

-- ai_generations
CREATE POLICY "select_own" ON public.ai_generations FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.ai_generations FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.ai_generations FOR UPDATE USING (user_id = (select auth.uid()));

-- ai_learning_data
CREATE POLICY "select_own" ON public.ai_learning_data FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.ai_learning_data FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- ai_optimization_rules
CREATE POLICY "select_own" ON public.ai_optimization_rules FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.ai_optimization_rules FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- analytics
CREATE POLICY "select_own" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_svc" ON public.analytics FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- autopilot_settings
CREATE POLICY "select_own" ON public.autopilot_settings FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.autopilot_settings FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.autopilot_settings FOR UPDATE USING (user_id = (select auth.uid()));

-- billing_events
CREATE POLICY "select_own" ON public.billing_events FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_svc" ON public.billing_events FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- brand_intelligence
CREATE POLICY "select_own" ON public.brand_intelligence FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.brand_intelligence FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- business_profiles
CREATE POLICY "select_own" ON public.business_profiles FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.business_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.business_profiles FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.business_profiles FOR DELETE USING (user_id = (select auth.uid()));

-- campaigns
CREATE POLICY "select_own" ON public.campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.campaigns FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.campaigns FOR DELETE USING (user_id = (select auth.uid()));

-- content_ideas
CREATE POLICY "select_own" ON public.content_ideas FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.content_ideas FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.content_ideas FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.content_ideas FOR DELETE USING (user_id = (select auth.uid()));

-- email_campaigns
CREATE POLICY "select_own" ON public.email_campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.email_campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.email_campaigns FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.email_campaigns FOR DELETE USING (user_id = (select auth.uid()));

-- email_subscribers
CREATE POLICY "select_own" ON public.email_subscribers FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.email_subscribers FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.email_subscribers FOR UPDATE USING (user_id = (select auth.uid()));

-- email_engagement
CREATE POLICY "select_svc" ON public.email_engagement FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "insert_svc" ON public.email_engagement FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- email_variants
CREATE POLICY "select_pub" ON public.email_variants FOR SELECT USING (true);

-- generated_media
CREATE POLICY "select_own" ON public.generated_media FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.generated_media FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.generated_media FOR DELETE USING (user_id = (select auth.uid()));

-- invoices
CREATE POLICY "select_own" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));

-- leads
CREATE POLICY "select_own" ON public.leads FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.leads FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.leads FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.leads FOR DELETE USING (user_id = (select auth.uid()));

-- media_library
CREATE POLICY "select_own" ON public.media_library FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.media_library FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.media_library FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.media_library FOR DELETE USING (user_id = (select auth.uid()));

-- payment_methods
CREATE POLICY "select_own" ON public.payment_methods FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.payment_methods FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.payment_methods FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.payment_methods FOR DELETE USING (user_id = (select auth.uid()));

-- post_analytics
CREATE POLICY "select_pub" ON public.post_analytics FOR SELECT USING (true);

-- post_performance
CREATE POLICY "select_pub" ON public.post_performance FOR SELECT USING (true);

-- posts
CREATE POLICY "select_own" ON public.posts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.posts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.posts FOR DELETE USING (user_id = (select auth.uid()));

-- profiles
CREATE POLICY "select_pub" ON public.profiles FOR SELECT USING (true);

-- scheduled_content
CREATE POLICY "select_own" ON public.scheduled_content FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.scheduled_content FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.scheduled_content FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.scheduled_content FOR DELETE USING (user_id = (select auth.uid()));

-- social_accounts
CREATE POLICY "select_own" ON public.social_accounts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.social_accounts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.social_accounts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.social_accounts FOR DELETE USING (user_id = (select auth.uid()));

-- social_posts
CREATE POLICY "select_own" ON public.social_posts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.social_posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.social_posts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "delete_own" ON public.social_posts FOR DELETE USING (user_id = (select auth.uid()));

-- subscription_plans
CREATE POLICY "select_pub" ON public.subscription_plans FOR SELECT USING (true);

-- user_preferences
CREATE POLICY "select_own" ON public.user_preferences FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.user_preferences FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "update_own" ON public.user_preferences FOR UPDATE USING (user_id = (select auth.uid()));

-- user_subscriptions
CREATE POLICY "select_own" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_own" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- usage_records
CREATE POLICY "select_own" ON public.usage_records FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "insert_svc" ON public.usage_records FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- ab_test_variants
CREATE POLICY "select_pub" ON public.ab_test_variants FOR SELECT USING (true);

