-- ============================================================================
-- SUPABASE PERFORMANCE OPTIMIZATION - MINIMAL VERSION
-- Only enables RLS and adds indexes - NO policies
-- ============================================================================

-- ENABLE RLS on all tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scheduled_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.engagement_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.marketing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.strategy_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.competitor_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brand_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.brand_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trending_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.theme_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_learning_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_optimization_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.autopilot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.generated_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_generations ENABLE ROW LEVEL SECURITY;

-- ADD PERFORMANCE INDEXES (these don't depend on specific column names)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON public.email_campaigns(user_id);

-- Done
