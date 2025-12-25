-- ============================================================================
-- COMPLETE RESET - Drop all policies and rebuild from scratch
-- ============================================================================

-- Drop ALL policies on ALL tables
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- CREATE CLEAN, MINIMAL POLICIES - One per table type
-- ============================================================================

-- Tables where users manage their own data (user_id column)
CREATE POLICY "Users manage own data" ON public.ab_tests FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.ai_generations FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.ai_learning_data FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.ai_optimization_rules FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.autopilot_settings FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.brand_intelligence FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.business_profiles FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.campaigns FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.content_ideas FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.email_campaigns FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.email_subscribers FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.generated_media FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.leads FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.media_library FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.payment_methods FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.posts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.scheduled_content FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.social_accounts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.social_posts FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users manage own data" ON public.user_preferences FOR ALL USING (user_id = (select auth.uid())) WITH CHECK (user_id = (select auth.uid()));

-- Read-only tables (analytics, billing)
CREATE POLICY "Users read own analytics" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Service inserts analytics" ON public.analytics FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users read own billing" ON public.billing_events FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Service inserts billing" ON public.billing_events FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users read own invoices" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));

CREATE POLICY "Users read own usage" ON public.usage_records FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Service inserts usage" ON public.usage_records FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users read own subscriptions" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users insert own subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- Public/read-only tables (no authentication)
CREATE POLICY "Public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.ab_test_variants FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.email_variants FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.post_analytics FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.post_performance FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.email_engagement FOR SELECT USING (true);

-- Service role operations
CREATE POLICY "Service operations" ON public.email_engagement FOR INSERT WITH CHECK (auth.role() = 'service_role');

