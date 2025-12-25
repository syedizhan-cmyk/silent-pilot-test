-- ============================================================================
-- ADD PERFORMANCE INDEXES - BASED ON ACTUAL SCHEMA
-- ============================================================================

-- Tables with user_id - add indexes
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_data_user_id ON public.ai_learning_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_optimization_rules_user_id ON public.ai_optimization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_settings_user_id ON public.autopilot_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_user_id ON public.billing_events(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_intelligence_user_id ON public.brand_intelligence(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_user_id ON public.content_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON public.email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_user_id ON public.email_subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_media_user_id ON public.generated_media(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_media_library_user_id ON public.media_library(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_performance_summary_user_id ON public.post_performance_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_content_user_id ON public.scheduled_content(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON public.usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_website_crawls_user_id ON public.website_crawls(user_id);

-- Timestamp indexes for common queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded_at ON public.analytics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON public.ai_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at DESC);

-- Status/platform indexes for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON public.social_posts(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON public.ai_generations(status);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_status ON public.campaigns(user_id, status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_status ON public.email_campaigns(user_id, status);

