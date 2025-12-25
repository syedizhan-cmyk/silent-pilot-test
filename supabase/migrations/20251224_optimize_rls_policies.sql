-- ============================================================================
-- OPTIMIZE RLS POLICIES - Use (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation for each row and improves performance
-- ============================================================================

-- ab_tests
DROP POLICY IF EXISTS "Users can view own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can view own ab_tests" ON public.ab_tests FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert ab_tests" ON public.ab_tests;
CREATE POLICY "Users can insert ab_tests" ON public.ab_tests FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can update own ab_tests" ON public.ab_tests FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own ab_tests" ON public.ab_tests;
CREATE POLICY "Users can delete own ab_tests" ON public.ab_tests FOR DELETE USING (user_id = (select auth.uid()));

-- ai_generations
DROP POLICY IF EXISTS "Users can view own ai_generations" ON public.ai_generations;
CREATE POLICY "Users can view own ai_generations" ON public.ai_generations FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert ai_generations" ON public.ai_generations;
CREATE POLICY "Users can insert ai_generations" ON public.ai_generations FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own ai_generations" ON public.ai_generations;
CREATE POLICY "Users can update own ai_generations" ON public.ai_generations FOR UPDATE USING (user_id = (select auth.uid()));

-- ai_learning_data
DROP POLICY IF EXISTS "Users can view own ai_learning_data" ON public.ai_learning_data;
CREATE POLICY "Users can view own ai_learning_data" ON public.ai_learning_data FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert ai_learning_data" ON public.ai_learning_data;
CREATE POLICY "Users can insert ai_learning_data" ON public.ai_learning_data FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- ai_optimization_rules
DROP POLICY IF EXISTS "Users can view own ai_optimization_rules" ON public.ai_optimization_rules;
CREATE POLICY "Users can view own ai_optimization_rules" ON public.ai_optimization_rules FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert ai_optimization_rules" ON public.ai_optimization_rules;
CREATE POLICY "Users can insert ai_optimization_rules" ON public.ai_optimization_rules FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- analytics
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics FOR SELECT USING (user_id = (select auth.uid()));

-- autopilot_settings
DROP POLICY IF EXISTS "Users can view own autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can view own autopilot_settings" ON public.autopilot_settings FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can insert autopilot_settings" ON public.autopilot_settings FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own autopilot_settings" ON public.autopilot_settings;
CREATE POLICY "Users can update own autopilot_settings" ON public.autopilot_settings FOR UPDATE USING (user_id = (select auth.uid()));

-- billing_events
DROP POLICY IF EXISTS "Users can view own billing_events" ON public.billing_events;
CREATE POLICY "Users can view own billing_events" ON public.billing_events FOR SELECT USING (user_id = (select auth.uid()));

-- brand_intelligence
DROP POLICY IF EXISTS "Users can view own brand_intelligence" ON public.brand_intelligence;
CREATE POLICY "Users can view own brand_intelligence" ON public.brand_intelligence FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert brand_intelligence" ON public.brand_intelligence;
CREATE POLICY "Users can insert brand_intelligence" ON public.brand_intelligence FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- business_profiles
DROP POLICY IF EXISTS "Users can view own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can view own business_profiles" ON public.business_profiles FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert business_profiles" ON public.business_profiles;
CREATE POLICY "Users can insert business_profiles" ON public.business_profiles FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can update own business_profiles" ON public.business_profiles FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own business_profiles" ON public.business_profiles;
CREATE POLICY "Users can delete own business_profiles" ON public.business_profiles FOR DELETE USING (user_id = (select auth.uid()));

-- campaigns
DROP POLICY IF EXISTS "Users can view own campaigns" ON public.campaigns;
CREATE POLICY "Users can view own campaigns" ON public.campaigns FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert campaigns" ON public.campaigns;
CREATE POLICY "Users can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own campaigns" ON public.campaigns;
CREATE POLICY "Users can update own campaigns" ON public.campaigns FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own campaigns" ON public.campaigns;
CREATE POLICY "Users can delete own campaigns" ON public.campaigns FOR DELETE USING (user_id = (select auth.uid()));

-- content_ideas
DROP POLICY IF EXISTS "Users can view own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can view own content_ideas" ON public.content_ideas FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert content_ideas" ON public.content_ideas;
CREATE POLICY "Users can insert content_ideas" ON public.content_ideas FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can update own content_ideas" ON public.content_ideas FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own content_ideas" ON public.content_ideas;
CREATE POLICY "Users can delete own content_ideas" ON public.content_ideas FOR DELETE USING (user_id = (select auth.uid()));

-- email_campaigns
DROP POLICY IF EXISTS "Users can view own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can view own email_campaigns" ON public.email_campaigns FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can insert email_campaigns" ON public.email_campaigns FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can update own email_campaigns" ON public.email_campaigns FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own email_campaigns" ON public.email_campaigns;
CREATE POLICY "Users can delete own email_campaigns" ON public.email_campaigns FOR DELETE USING (user_id = (select auth.uid()));

-- email_subscribers
DROP POLICY IF EXISTS "Users can view own email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can view own email_subscribers" ON public.email_subscribers FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can insert email_subscribers" ON public.email_subscribers FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own email_subscribers" ON public.email_subscribers;
CREATE POLICY "Users can update own email_subscribers" ON public.email_subscribers FOR UPDATE USING (user_id = (select auth.uid()));

-- generated_media
DROP POLICY IF EXISTS "Users can view own generated_media" ON public.generated_media;
CREATE POLICY "Users can view own generated_media" ON public.generated_media FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert generated_media" ON public.generated_media;
CREATE POLICY "Users can insert generated_media" ON public.generated_media FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own generated_media" ON public.generated_media;
CREATE POLICY "Users can delete own generated_media" ON public.generated_media FOR DELETE USING (user_id = (select auth.uid()));

-- invoices
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices FOR SELECT USING (user_id = (select auth.uid()));

-- leads
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
CREATE POLICY "Users can insert leads" ON public.leads FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
CREATE POLICY "Users can update own leads" ON public.leads FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;
CREATE POLICY "Users can delete own leads" ON public.leads FOR DELETE USING (user_id = (select auth.uid()));

-- media_library
DROP POLICY IF EXISTS "Users can view own media_library" ON public.media_library;
CREATE POLICY "Users can view own media_library" ON public.media_library FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert media_library" ON public.media_library;
CREATE POLICY "Users can insert media_library" ON public.media_library FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own media_library" ON public.media_library;
CREATE POLICY "Users can update own media_library" ON public.media_library FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own media_library" ON public.media_library;
CREATE POLICY "Users can delete own media_library" ON public.media_library FOR DELETE USING (user_id = (select auth.uid()));

-- payment_methods
DROP POLICY IF EXISTS "Users can view own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can view own payment_methods" ON public.payment_methods FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert payment_methods" ON public.payment_methods;
CREATE POLICY "Users can insert payment_methods" ON public.payment_methods FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can update own payment_methods" ON public.payment_methods FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own payment_methods" ON public.payment_methods;
CREATE POLICY "Users can delete own payment_methods" ON public.payment_methods FOR DELETE USING (user_id = (select auth.uid()));

-- posts
DROP POLICY IF EXISTS "Users can view own posts" ON public.posts;
CREATE POLICY "Users can view own posts" ON public.posts FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert posts" ON public.posts;
CREATE POLICY "Users can insert posts" ON public.posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (user_id = (select auth.uid()));

-- scheduled_content
DROP POLICY IF EXISTS "Users can view own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can view own scheduled_content" ON public.scheduled_content FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can insert scheduled_content" ON public.scheduled_content FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can update own scheduled_content" ON public.scheduled_content FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own scheduled_content" ON public.scheduled_content;
CREATE POLICY "Users can delete own scheduled_content" ON public.scheduled_content FOR DELETE USING (user_id = (select auth.uid()));

-- social_accounts
DROP POLICY IF EXISTS "Users can view own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can view own social_accounts" ON public.social_accounts FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert social_accounts" ON public.social_accounts;
CREATE POLICY "Users can insert social_accounts" ON public.social_accounts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can update own social_accounts" ON public.social_accounts FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own social_accounts" ON public.social_accounts;
CREATE POLICY "Users can delete own social_accounts" ON public.social_accounts FOR DELETE USING (user_id = (select auth.uid()));

-- social_posts
DROP POLICY IF EXISTS "Users can view own social_posts" ON public.social_posts;
CREATE POLICY "Users can view own social_posts" ON public.social_posts FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert social_posts" ON public.social_posts;
CREATE POLICY "Users can insert social_posts" ON public.social_posts FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own social_posts" ON public.social_posts;
CREATE POLICY "Users can update own social_posts" ON public.social_posts FOR UPDATE USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can delete own social_posts" ON public.social_posts;
CREATE POLICY "Users can delete own social_posts" ON public.social_posts FOR DELETE USING (user_id = (select auth.uid()));

-- user_preferences
DROP POLICY IF EXISTS "Users can view own user_preferences" ON public.user_preferences;
CREATE POLICY "Users can view own user_preferences" ON public.user_preferences FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert user_preferences" ON public.user_preferences;
CREATE POLICY "Users can insert user_preferences" ON public.user_preferences FOR INSERT WITH CHECK (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can update own user_preferences" ON public.user_preferences;
CREATE POLICY "Users can update own user_preferences" ON public.user_preferences FOR UPDATE USING (user_id = (select auth.uid()));

-- user_subscriptions
DROP POLICY IF EXISTS "Users can view own user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can view own user_subscriptions" ON public.user_subscriptions FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert user_subscriptions" ON public.user_subscriptions;
CREATE POLICY "Users can insert user_subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- usage_records
DROP POLICY IF EXISTS "Users can view own usage_records" ON public.usage_records;
CREATE POLICY "Users can view own usage_records" ON public.usage_records FOR SELECT USING (user_id = (select auth.uid()));

-- website_crawls
DROP POLICY IF EXISTS "Users can view own website_crawls" ON public.website_crawls;
CREATE POLICY "Users can view own website_crawls" ON public.website_crawls FOR SELECT USING (user_id = (select auth.uid()));
DROP POLICY IF EXISTS "Users can insert website_crawls" ON public.website_crawls;
CREATE POLICY "Users can insert website_crawls" ON public.website_crawls FOR INSERT WITH CHECK (user_id = (select auth.uid()));

