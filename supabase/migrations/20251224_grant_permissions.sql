-- ============================================================================
-- GRANT PERMISSIONS TO AUTHENTICATED USERS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ab_tests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ab_test_variants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_generations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_learning_data TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_optimization_rules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.autopilot_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_intelligence TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_ideas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_campaigns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_engagement TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_subscribers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_variants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generated_media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_analytics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_performance TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_content TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_posts TO authenticated;
GRANT SELECT ON public.subscription_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_preferences TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.website_crawls TO authenticated;

-- Grant anon minimal permissions (for public endpoints)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.subscription_plans TO anon;

