-- ============================================================================
-- FINAL CLEANUP - Handle remaining edge cases
-- ============================================================================

-- Drop all remaining generic policies
DROP POLICY IF EXISTS "enable_read" ON public.ab_tests;
DROP POLICY IF EXISTS "enable_insert" ON public.ab_tests;
DROP POLICY IF EXISTS "enable_update" ON public.ab_tests;
DROP POLICY IF EXISTS "enable_delete" ON public.ab_tests;
DROP POLICY IF EXISTS "enable_read" ON public.ab_test_variants;
DROP POLICY IF EXISTS "enable_read" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "enable_insert" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "enable_read" ON public.autopilot_settings;
DROP POLICY IF EXISTS "enable_insert" ON public.autopilot_settings;
DROP POLICY IF EXISTS "enable_update" ON public.autopilot_settings;
DROP POLICY IF EXISTS "enable_read" ON public.billing_events;
DROP POLICY IF EXISTS "enable_insert" ON public.billing_events;
DROP POLICY IF EXISTS "enable_read" ON public.brand_intelligence;
DROP POLICY IF EXISTS "enable_insert" ON public.brand_intelligence;
DROP POLICY IF EXISTS "enable_read" ON public.content_ideas;
DROP POLICY IF EXISTS "enable_insert" ON public.content_ideas;
DROP POLICY IF EXISTS "enable_update" ON public.content_ideas;
DROP POLICY IF EXISTS "enable_delete" ON public.content_ideas;
DROP POLICY IF EXISTS "enable_read" ON public.email_engagement;
DROP POLICY IF EXISTS "enable_insert" ON public.email_engagement;
DROP POLICY IF EXISTS "enable_read" ON public.email_variants;
DROP POLICY IF EXISTS "enable_read" ON public.leads;
DROP POLICY IF EXISTS "enable_insert" ON public.leads;
DROP POLICY IF EXISTS "enable_update" ON public.leads;
DROP POLICY IF EXISTS "enable_delete" ON public.leads;
DROP POLICY IF EXISTS "enable_read" ON public.media_library;
DROP POLICY IF EXISTS "enable_insert" ON public.media_library;
DROP POLICY IF EXISTS "enable_update" ON public.media_library;
DROP POLICY IF EXISTS "enable_read" ON public.post_analytics;
DROP POLICY IF EXISTS "enable_read" ON public.post_performance;
DROP POLICY IF EXISTS "enable_read" ON public.social_posts;
DROP POLICY IF EXISTS "enable_insert" ON public.social_posts;
DROP POLICY IF EXISTS "enable_update" ON public.social_posts;
DROP POLICY IF EXISTS "enable_delete" ON public.social_posts;
DROP POLICY IF EXISTS "enable_read" ON public.usage_records;
DROP POLICY IF EXISTS "enable_insert" ON public.usage_records;
DROP POLICY IF EXISTS "enable_read" ON public.website_crawls;
DROP POLICY IF EXISTS "enable_insert" ON public.website_crawls;
DROP POLICY IF EXISTS "enable_read_public" ON public.subscription_plans;

-- ============================================================================
-- CREATE HIGHLY OPTIMIZED POLICIES using cached auth.uid()
-- ============================================================================

-- Tables with user_id that users directly manage
CREATE POLICY "auth_users" ON public.ab_tests FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.ai_generations FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.ai_learning_data FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.ai_optimization_rules FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.autopilot_settings FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.brand_intelligence FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.business_profiles FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.campaigns FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.content_ideas FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.email_campaigns FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.email_subscribers FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.generated_media FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.leads FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.media_library FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.payment_methods FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.posts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.scheduled_content FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.social_accounts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.social_posts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "auth_users" ON public.user_preferences FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));

-- Read-only tables for users
CREATE POLICY "auth_read" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "auth_read" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "auth_read" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "auth_read" ON public.usage_records FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "auth_read" ON public.billing_events FOR SELECT USING (user_id = (select auth.uid()));

-- Service role operations (analytics, tracking, billing)
CREATE POLICY "service_role" ON public.analytics FOR INSERT USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "service_role" ON public.usage_records FOR INSERT USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "service_role" ON public.billing_events FOR INSERT USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Public tables (no authentication needed)
CREATE POLICY "public_read" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.ab_test_variants FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.email_variants FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.post_analytics FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.post_performance FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.email_engagement FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.profiles FOR SELECT USING (true);

-- Enable insert for service operations only
CREATE POLICY "service_insert" ON public.email_engagement FOR INSERT WITH CHECK (auth.role() = 'service_role');

