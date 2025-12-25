-- ============================================================================
-- CLEAN ALL POLICIES - Remove ALL policies and recreate only optimized ones
-- This is a comprehensive cleanup
-- ============================================================================

-- Drop ALL policies on all tables to start fresh
DROP POLICY IF EXISTS "Users can view own ab_tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can insert ab_tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can update own ab_tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can delete own ab_tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can manage their A/B tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can view their own A/B tests" ON public.ab_tests;

DROP POLICY IF EXISTS "Users can view ab_test_variants" ON public.ab_test_variants;
DROP POLICY IF EXISTS "Service role can manage ab_test_variants" ON public.ab_test_variants;

DROP POLICY IF EXISTS "Users can view own ai_generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can insert ai_generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can update own ai_generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can view their own generations" ON public.ai_generations;

DROP POLICY IF EXISTS "Users can view own ai_learning_data" ON public.ai_learning_data;
DROP POLICY IF EXISTS "Users can insert ai_learning_data" ON public.ai_learning_data;
DROP POLICY IF EXISTS "Users can view their own learning data" ON public.ai_learning_data;

DROP POLICY IF EXISTS "Users can view own ai_optimization_rules" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "Users can insert ai_optimization_rules" ON public.ai_optimization_rules;
DROP POLICY IF EXISTS "Users can view their own optimization" ON public.ai_optimization_rules;

DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Service role can insert analytics" ON public.analytics;
DROP POLICY IF EXISTS "Users can view their analytics" ON public.analytics;
DROP POLICY IF EXISTS "Enable read for users and service role" ON public.analytics;

DROP POLICY IF EXISTS "Users can view own autopilot_settings" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can insert autopilot_settings" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can update own autopilot_settings" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can view their own autopilot settings" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can manage their autopilot settings" ON public.autopilot_settings;

DROP POLICY IF EXISTS "Users can view own billing_events" ON public.billing_events;
DROP POLICY IF EXISTS "Service role can insert billing_events" ON public.billing_events;
DROP POLICY IF EXISTS "Users can view their own billing events" ON public.billing_events;

DROP POLICY IF EXISTS "Users can view own brand_intelligence" ON public.brand_intelligence;
DROP POLICY IF EXISTS "Users can insert brand_intelligence" ON public.brand_intelligence;
DROP POLICY IF EXISTS "Users can view their own brand intelligence" ON public.brand_intelligence;

DROP POLICY IF EXISTS "Users can view own business_profiles" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can insert business_profiles" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can update own business_profiles" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can delete own business_profiles" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can view their own business profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can manage their business profile" ON public.business_profiles;

DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can manage own campaigns" ON public.campaigns;

DROP POLICY IF EXISTS "Users can view own content_ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can insert content_ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can update own content_ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can delete own content_ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can insert their own content ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can view their own content ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can manage their content ideas" ON public.content_ideas;

DROP POLICY IF EXISTS "Users can view own email_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can insert email_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can update own email_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can delete own email_campaigns" ON public.email_campaigns;
DROP POLICY IF EXISTS "Enable read for users and service role" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can manage their email campaigns" ON public.email_campaigns;

DROP POLICY IF EXISTS "Users can view own email_engagement" ON public.email_engagement;
DROP POLICY IF EXISTS "Service role can insert engagement" ON public.email_engagement;
DROP POLICY IF EXISTS "Users can view email_engagement" ON public.email_engagement;

DROP POLICY IF EXISTS "Users can view own email_subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can insert email_subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can update own email_subscribers" ON public.email_subscribers;
DROP POLICY IF EXISTS "Users can manage their subscribers" ON public.email_subscribers;

DROP POLICY IF EXISTS "Users can view email_variants" ON public.email_variants;
DROP POLICY IF EXISTS "Users can manage their campaign variants" ON public.email_variants;
DROP POLICY IF EXISTS "Service role can manage email_variants" ON public.email_variants;

DROP POLICY IF EXISTS "Users can view own generated_media" ON public.generated_media;
DROP POLICY IF EXISTS "Users can insert generated_media" ON public.generated_media;
DROP POLICY IF EXISTS "Users can delete own generated_media" ON public.generated_media;
DROP POLICY IF EXISTS "Users can manage their generated media" ON public.generated_media;

DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;

DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can manage own leads" ON public.leads;

DROP POLICY IF EXISTS "Users can view own media_library" ON public.media_library;
DROP POLICY IF EXISTS "Users can insert media_library" ON public.media_library;
DROP POLICY IF EXISTS "Users can update own media_library" ON public.media_library;
DROP POLICY IF EXISTS "Users can delete own media_library" ON public.media_library;
DROP POLICY IF EXISTS "Users can delete their own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can manage their media" ON public.media_library;

DROP POLICY IF EXISTS "Users can view own payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can insert payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can update own payment_methods" ON public.payment_methods;
DROP POLICY IF EXISTS "Users can delete own payment_methods" ON public.payment_methods;

DROP POLICY IF EXISTS "Users can view post_analytics" ON public.post_analytics;
DROP POLICY IF EXISTS "Users can view analytics for their posts" ON public.post_analytics;

DROP POLICY IF EXISTS "Users can view post_performance" ON public.post_performance;
DROP POLICY IF EXISTS "Users can view performance of their posts" ON public.post_performance;

DROP POLICY IF EXISTS "Users can view own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can manage own posts" ON public.posts;

DROP POLICY IF EXISTS "Users can view own scheduled_content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can insert scheduled_content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can update own scheduled_content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can delete own scheduled_content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can insert their own scheduled content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can manage their scheduled content" ON public.scheduled_content;

DROP POLICY IF EXISTS "Users can view own social_accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can insert social_accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can update own social_accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can delete own social_accounts" ON public.social_accounts;
DROP POLICY IF EXISTS "Users can manage their social accounts" ON public.social_accounts;

DROP POLICY IF EXISTS "Users can view own social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can insert social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can update own social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can delete own social_posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.social_posts;

DROP POLICY IF EXISTS "Everyone can view subscription_plans" ON public.subscription_plans;

DROP POLICY IF EXISTS "Users can view own user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own user_preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can manage their preferences" ON public.user_preferences;

DROP POLICY IF EXISTS "Users can view own user_subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert user_subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;

DROP POLICY IF EXISTS "Users can view own usage_records" ON public.usage_records;
DROP POLICY IF EXISTS "Service role can insert usage_records" ON public.usage_records;
DROP POLICY IF EXISTS "Users can view their usage" ON public.usage_records;

DROP POLICY IF EXISTS "Users can view own website_crawls" ON public.website_crawls;
DROP POLICY IF EXISTS "Users can insert website_crawls" ON public.website_crawls;
DROP POLICY IF EXISTS "Users can view their own crawls" ON public.website_crawls;
DROP POLICY IF EXISTS "Users can insert their own crawls" ON public.website_crawls;

-- ============================================================================
-- NOW RECREATE ONLY CLEAN, OPTIMIZED POLICIES (ONE PER ROLE/ACTION)
-- ============================================================================

-- SELECT policies (keep only one per table)
CREATE POLICY "Users can view own data" ON public.ab_tests FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.ai_generations FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.ai_learning_data FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.ai_optimization_rules FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.autopilot_settings FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.billing_events FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.brand_intelligence FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.business_profiles FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.content_ideas FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.email_campaigns FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.email_subscribers FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.generated_media FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.leads FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.media_library FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.payment_methods FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.posts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.scheduled_content FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.social_accounts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.social_posts FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.user_preferences FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.usage_records FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own data" ON public.website_crawls FOR SELECT USING (user_id = (select auth.uid()));
CREATE POLICY "Service role can select" ON public.email_engagement FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can select" ON public.ab_test_variants FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can select" ON public.post_analytics FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can select" ON public.post_performance FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Service role can select" ON public.email_variants FOR SELECT USING (auth.role() = 'service_role');

-- INSERT policies
CREATE POLICY "Users can insert" ON public.ab_tests FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.ai_generations FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.ai_learning_data FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.ai_optimization_rules FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.autopilot_settings FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.brand_intelligence FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.business_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.content_ideas FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.email_campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.email_subscribers FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.generated_media FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.leads FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.media_library FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.payment_methods FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.scheduled_content FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.social_accounts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.social_posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.user_preferences FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can insert" ON public.website_crawls FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Service role can insert" ON public.email_engagement FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can insert" ON public.analytics FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service role can insert" ON public.billing_events FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- UPDATE policies
CREATE POLICY "Users can update" ON public.ab_tests FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.ai_generations FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.autopilot_settings FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.business_profiles FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.campaigns FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.content_ideas FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.email_campaigns FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.email_subscribers FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.leads FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.media_library FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.payment_methods FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.posts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.scheduled_content FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.social_accounts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.social_posts FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update" ON public.user_preferences FOR UPDATE USING (user_id = (select auth.uid()));

-- DELETE policies
CREATE POLICY "Users can delete" ON public.ab_tests FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.business_profiles FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.campaigns FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.content_ideas FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.email_campaigns FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.generated_media FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.leads FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.media_library FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.payment_methods FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.posts FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.scheduled_content FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.social_accounts FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can delete" ON public.social_posts FOR DELETE USING (user_id = (select auth.uid()));

-- Special case: Read-only public tables
CREATE POLICY "Everyone can view" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Everyone can view" ON public.email_variants FOR SELECT USING (true);
CREATE POLICY "Everyone can view" ON public.ab_test_variants FOR SELECT USING (true);
CREATE POLICY "Everyone can view" ON public.post_analytics FOR SELECT USING (true);
CREATE POLICY "Everyone can view" ON public.post_performance FOR SELECT USING (true);

-- ============================================================================
-- DONE - All policies cleaned up and consolidated
-- ============================================================================
