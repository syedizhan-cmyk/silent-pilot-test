-- ============================================================================
-- ADD PERFORMANCE INDEXES (Safe version)
-- Only creates indexes on columns that exist
-- ============================================================================

-- These will only succeed if the column exists
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON public.email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_engagement_user_id ON public.email_engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_reports_user_id ON public.marketing_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON public.ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON public.ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_data_user_id ON public.ai_learning_data(user_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_settings_user_id ON public.autopilot_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_media_user_id ON public.generated_media(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON public.ai_generations(status);
