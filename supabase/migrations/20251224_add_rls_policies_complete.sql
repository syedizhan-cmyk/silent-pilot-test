-- ============================================================================
-- COMPLETE RLS POLICIES - INSERT, UPDATE, DELETE
-- ============================================================================

-- ab_tests
DROP POLICY IF EXISTS "Users can insert ab_tests" ON public.ab_tests;
CREATE POLICY "Users can insert ab_tests" ON public.ab_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can update own ab_tests" ON public.ab_tests FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can delete own ab_tests" ON public.ab_tests FOR DELETE USING (auth.uid() = user_id);

-- ai_generations
DROP POLICY IF EXISTS "Users can insert ai_generations" ON public.ai_generations;
CREATE POLICY "Users can insert ai_generations" ON public.ai_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own ai_generations" ON public.ai_generations;
CREATE POLICY "Users can update own ai_generations" ON public.ai_generations FOR UPDATE USING (auth.uid() = user_id);

-- ai_learning_data
DROP POLICY IF EXISTS "Users can insert ai_learning_data" ON public.ai_learning_data;
CREATE POLICY "Users can insert ai_learning_data" ON public.ai_learning_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ai_optimization_rules
DROP POLICY IF EXISTS "Users can insert ai_optimization_rules" ON public.ai_optimization_rules;
CREATE POLICY "Users can insert ai_optimization_rules" ON public.ai_optimization_rules FOR INSERT WITH CHECK (auth.uid() = user_id);

-- analytics
DROP POLICY IF EXISTS "Service role can insert analytics" ON public.analytics;
CREATE POLICY "Service role can insert analytics" ON public.analytics FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- autopilot_settings
DROP POLICY IF EXISTS "Users can insert autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can insert autopilot_settings" ON public.autopilot_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can update own autopilot_settings" ON public.autopilot_settings FOR UPDATE USING (auth.uid() = user_id);

-- billing_events
DROP POLICY IF EXISTS "Service role can insert billing_events" ON public.billing_events;
CREATE POLICY "Service role can insert billing_events" ON public.billing_events FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- brand_intelligence
DROP POLICY IF EXISTS "Users can insert brand_intelligence" ON public.brand_intelligence;
CREATE POLICY "Users can insert brand_intelligence" ON public.brand_intelligence FOR INSERT WITH CHECK (auth.uid() = user_id);

-- business_profiles
DROP POLICY IF EXISTS "Users can insert business_profiles" ON public.business_profiles;
CREATE POLICY "Users can insert business_profiles" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can delete own business_profiles" ON public.business_profiles FOR DELETE USING (auth.uid() = user_id);

-- campaigns
DROP POLICY IF EXISTS "Users can insert campaigns" ON public.campaigns;
CREATE POLICY "Users can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.campaigns;
CREATE POLICY "Users can delete own campaigns" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);

-- content_ideas
DROP POLICY IF EXISTS "Users can insert content_ideas" ON public.content_ideas;
CREATE POLICY "Users can insert content_ideas" ON public.content_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can update own content_ideas" ON public.content_ideas FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can delete own content_ideas" ON public.content_ideas FOR DELETE USING (auth.uid() = user_id);

-- email_campaigns
DROP POLICY IF EXISTS "Users can insert email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can insert email_campaigns" ON public.email_campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can delete own email_campaigns" ON public.email_campaigns FOR DELETE USING (auth.uid() = user_id);

-- email_subscribers
DROP POLICY IF EXISTS "Users can insert email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can insert email_subscribers" ON public.email_subscribers FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can update own email_subscribers" ON public.email_subscribers FOR UPDATE USING (auth.uid() = user_id);

-- generated_media
DROP POLICY IF EXISTS "Users can insert generated_media" ON public.generated_media;
CREATE POLICY "Users can insert generated_media" ON public.generated_media FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own generated_media" ON public.generated_media;
CREATE POLICY "Users can delete own generated_media" ON public.generated_media FOR DELETE USING (auth.uid() = user_id);

-- invoices (mostly read-only, but allow service role)
DROP POLICY IF EXISTS "Service role can insert invoices" ON public.invoices;
CREATE POLICY "Service role can insert invoices" ON public.invoices FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- leads
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
CREATE POLICY "Users can insert leads" ON public.leads FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (auth.uid() = user_id);

-- media_library
DROP POLICY IF EXISTS "Users can insert media_library" ON public.media_library;
CREATE POLICY "Users can insert media_library" ON public.media_library FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own media_library" ON public.media_library;
CREATE POLICY "Users can update own media_library" ON public.media_library FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own media_library" ON public.media_library;
CREATE POLICY "Users can delete own media_library" ON public.media_library FOR DELETE USING (auth.uid() = user_id);

-- payment_methods
DROP POLICY IF EXISTS "Users can insert payment_methods" ON public.payment_methods;
CREATE POLICY "Users can insert payment_methods" ON public.payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can update own payment_methods" ON public.payment_methods FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can delete own payment_methods" ON public.payment_methods FOR DELETE USING (auth.uid() = user_id);

-- posts
DROP POLICY IF EXISTS "Users can insert posts" ON public.posts;
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- scheduled_content
DROP POLICY IF EXISTS "Users can insert scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can insert scheduled_content" ON public.scheduled_content FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can update own scheduled_content" ON public.scheduled_content FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can delete own scheduled_content" ON public.scheduled_content FOR DELETE USING (auth.uid() = user_id);

-- social_accounts
DROP POLICY IF EXISTS "Users can insert social_accounts" ON public.social_accounts;
CREATE POLICY "Users can insert social_accounts" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can update own social_accounts" ON public.social_accounts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can delete own social_accounts" ON public.social_accounts FOR DELETE USING (auth.uid() = user_id);

-- social_posts
DROP POLICY IF EXISTS "Users can insert social_posts" ON public.social_posts;
CREATE POLICY "Users can insert social_posts" ON public.social_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own social_posts" ON public.social_posts;
CREATE POLICY "Users can update own social_posts" ON public.social_posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own social_posts" ON public.social_posts;
CREATE POLICY "Users can delete own social_posts" ON public.social_posts FOR DELETE USING (auth.uid() = user_id);

-- user_preferences
DROP POLICY IF EXISTS "Users can insert user_preferences" ON public.user_preferences;
CREATE POLICY "Users can insert user_preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own user_preferences" ON public.user_preferences;
CREATE POLICY "Users can update own user_preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- user_subscriptions
DROP POLICY IF EXISTS "Users can insert user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can insert user_subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Service role can update user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Service role can update user_subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.role() = 'service_role');

-- usage_records
DROP POLICY IF EXISTS "Service role can insert usage_records" ON public.usage_records;
CREATE POLICY "Service role can insert usage_records" ON public.usage_records FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- website_crawls
DROP POLICY IF EXISTS "Users can insert website_crawls" ON public.website_crawls;
CREATE POLICY "Users can insert website_crawls" ON public.website_crawls FOR INSERT WITH CHECK (auth.uid() = user_id);

