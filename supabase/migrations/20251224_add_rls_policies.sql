-- ============================================================================
-- ADD RLS POLICIES FOR ALL TABLES
-- ============================================================================

-- ab_tests
DROP POLICY IF EXISTS "Users can view own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can view own ab_tests" ON public.ab_tests FOR SELECT USING (auth.uid() = user_id);

-- ab_test_variants (has test_id, not user_id)
DROP POLICY IF EXISTS "Users can view ab_test_variants" ON public.ab_test_variants;
CREATE POLICY "Users can view ab_test_variants" ON public.ab_test_variants FOR SELECT USING (true);

-- ai_generations
DROP POLICY IF EXISTS "Users can view own ai_generations" ON public.ai_generations;
CREATE POLICY "Users can view own ai_generations" ON public.ai_generations FOR SELECT USING (auth.uid() = user_id);

-- ai_learning_data
DROP POLICY IF EXISTS "Users can view own ai_learning_data" ON public.ai_learning_data;
CREATE POLICY "Users can view own ai_learning_data" ON public.ai_learning_data FOR SELECT USING (auth.uid() = user_id);

-- ai_optimization_rules
DROP POLICY IF EXISTS "Users can view own ai_optimization_rules" ON public.ai_optimization_rules;
CREATE POLICY "Users can view own ai_optimization_rules" ON public.ai_optimization_rules FOR SELECT USING (auth.uid() = user_id);

-- analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics FOR SELECT USING (auth.uid() = user_id);

-- autopilot_settings
DROP POLICY IF EXISTS "Users can view own autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can view own autopilot_settings" ON public.autopilot_settings FOR SELECT USING (auth.uid() = user_id);

-- billing_events
DROP POLICY IF EXISTS "Users can view own billing_events" ON public.billing_events;
CREATE POLICY "Users can view own billing_events" ON public.billing_events FOR SELECT USING (auth.uid() = user_id);

-- brand_intelligence
DROP POLICY IF EXISTS "Users can view own brand_intelligence" ON public.brand_intelligence;
CREATE POLICY "Users can view own brand_intelligence" ON public.brand_intelligence FOR SELECT USING (auth.uid() = user_id);

-- business_profiles
DROP POLICY IF EXISTS "Users can view own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can view own business_profiles" ON public.business_profiles FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can update own business_profiles" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);

-- campaigns
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
CREATE POLICY "Users can view own campaigns" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);

-- content_ideas
DROP POLICY IF EXISTS "Users can view own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can view own content_ideas" ON public.content_ideas FOR SELECT USING (auth.uid() = user_id);

-- email_campaigns
DROP POLICY IF EXISTS "Users can view own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can view own email_campaigns" ON public.email_campaigns FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can update own email_campaigns" ON public.email_campaigns FOR UPDATE USING (auth.uid() = user_id);

-- email_engagement (uses subscriber_id, not user_id)
DROP POLICY IF EXISTS "Users can view email_engagement" ON public.email_engagement;
CREATE POLICY "Users can view email_engagement" ON public.email_engagement FOR SELECT USING (true);

-- email_subscribers
DROP POLICY IF EXISTS "Users can view own email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can view own email_subscribers" ON public.email_subscribers FOR SELECT USING (auth.uid() = user_id);

-- email_variants (uses campaign_id, not user_id)
DROP POLICY IF EXISTS "Users can view email_variants" ON public.email_variants;
CREATE POLICY "Users can view email_variants" ON public.email_variants FOR SELECT USING (true);

-- generated_media
DROP POLICY IF EXISTS "Users can view own generated_media" ON public.generated_media;
CREATE POLICY "Users can view own generated_media" ON public.generated_media FOR SELECT USING (auth.uid() = user_id);

-- invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);

-- leads
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);

-- media_library
DROP POLICY IF EXISTS "Users can view own media_library" ON public.media_library;
CREATE POLICY "Users can view own media_library" ON public.media_library FOR SELECT USING (auth.uid() = user_id);

-- payment_methods
DROP POLICY IF EXISTS "Users can view own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can view own payment_methods" ON public.payment_methods FOR SELECT USING (auth.uid() = user_id);

-- post_analytics (uses post_id, not user_id)
DROP POLICY IF EXISTS "Users can view post_analytics" ON public.post_analytics;
CREATE POLICY "Users can view post_analytics" ON public.post_analytics FOR SELECT USING (true);

-- post_performance (uses post_id, not user_id)
DROP POLICY IF EXISTS "Users can view post_performance" ON public.post_performance;
CREATE POLICY "Users can view post_performance" ON public.post_performance FOR SELECT USING (true);

-- posts
DROP POLICY IF EXISTS "Users can view own posts" ON public.posts;
CREATE POLICY "Users can view own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);

-- scheduled_content
DROP POLICY IF EXISTS "Users can view own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can view own scheduled_content" ON public.scheduled_content FOR SELECT USING (auth.uid() = user_id);

-- social_accounts
DROP POLICY IF EXISTS "Users can view own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can view own social_accounts" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);

-- social_posts
DROP POLICY IF EXISTS "Users can view own social_posts" ON public.social_posts;
CREATE POLICY "Users can view own social_posts" ON public.social_posts FOR SELECT USING (auth.uid() = user_id);

-- subscription_plans (no user_id - public data)
DROP POLICY IF EXISTS "Everyone can view subscription_plans" ON public.subscription_plans;
CREATE POLICY "Everyone can view subscription_plans" ON public.subscription_plans FOR SELECT USING (true);

-- user_preferences
DROP POLICY IF EXISTS "Users can view own user_preferences" ON public.user_preferences;
CREATE POLICY "Users can view own user_preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

-- user_subscriptions
DROP POLICY IF EXISTS "Users can view own user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own user_subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- usage_records
DROP POLICY IF EXISTS "Users can view own usage_records" ON public.usage_records;
CREATE POLICY "Users can view own usage_records" ON public.usage_records FOR SELECT USING (auth.uid() = user_id);

-- website_crawls
DROP POLICY IF EXISTS "Users can view own website_crawls" ON public.website_crawls;
CREATE POLICY "Users can view own website_crawls" ON public.website_crawls FOR SELECT USING (auth.uid() = user_id);

