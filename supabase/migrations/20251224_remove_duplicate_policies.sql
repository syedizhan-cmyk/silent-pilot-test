-- ============================================================================
-- REMOVE DUPLICATE RLS POLICIES
-- Consolidate multiple permissive policies on same role/action
-- ============================================================================

-- This script removes duplicate policies, keeping only the optimized (select auth.uid()) versions

-- ab_tests: Remove old policies, keep optimized ones
DROP POLICY IF EXISTS "Users can manage their A/B tests" ON public.ab_tests;
DROP POLICY IF EXISTS "Users can view their own A/B tests" ON public.ab_tests;

-- ab_test_variants: Clean up
DROP POLICY IF EXISTS "Service role can manage ab_test_variants" ON public.ab_test_variants;
DROP POLICY IF EXISTS "Users can view ab_test_variants" ON public.ab_test_variants;

-- ai_generations: Clean up old policies
DROP POLICY IF EXISTS "Users can insert their own generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Users can view their own generations" ON public.ai_generations;

-- ai_learning_data: Clean up
DROP POLICY IF EXISTS "Users can view their own learning data" ON public.ai_learning_data;

-- ai_optimization_rules: Clean up
DROP POLICY IF EXISTS "Users can view their own optimization" ON public.ai_optimization_rules;

-- analytics: Clean up
DROP POLICY IF EXISTS "Users can view their analytics" ON public.analytics;
DROP POLICY IF EXISTS "Enable read for users and service role" ON public.analytics;

-- autopilot_settings: Clean up
DROP POLICY IF EXISTS "Users can view their own autopilot settings" ON public.autopilot_settings;
DROP POLICY IF EXISTS "Users can manage their autopilot settings" ON public.autopilot_settings;

-- billing_events: Clean up
DROP POLICY IF EXISTS "Service role can insert billing_events" ON public.billing_events;
DROP POLICY IF EXISTS "Users can view their own billing events" ON public.billing_events;

-- brand_intelligence: Clean up
DROP POLICY IF EXISTS "Users can view their own brand intelligence" ON public.brand_intelligence;

-- business_profiles: Clean up
DROP POLICY IF EXISTS "Users can view their own business profile" ON public.business_profiles;
DROP POLICY IF EXISTS "Users can manage their business profile" ON public.business_profiles;

-- campaigns: Clean up
DROP POLICY IF EXISTS "Users can manage own campaigns" ON public.campaigns;

-- content_ideas: Clean up
DROP POLICY IF EXISTS "Users can insert their own content ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can view their own content ideas" ON public.content_ideas;
DROP POLICY IF EXISTS "Users can manage their content ideas" ON public.content_ideas;

-- email_campaigns: Clean up
DROP POLICY IF EXISTS "Enable read for users and service role" ON public.email_campaigns;
DROP POLICY IF EXISTS "Users can manage their email campaigns" ON public.email_campaigns;

-- email_subscribers: Clean up
DROP POLICY IF EXISTS "Users can manage their subscribers" ON public.email_subscribers;

-- email_variants: Clean up
DROP POLICY IF EXISTS "Users can manage their campaign variants" ON public.email_variants;
DROP POLICY IF EXISTS "Service role can manage email_variants" ON public.email_variants;

-- generated_media: Clean up
DROP POLICY IF EXISTS "Users can manage their generated media" ON public.generated_media;

-- leads: Clean up
DROP POLICY IF EXISTS "Users can manage own leads" ON public.leads;

-- media_library: Clean up
DROP POLICY IF EXISTS "Users can delete their own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can manage their media" ON public.media_library;

-- payment_methods: Clean up
DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.payment_methods;

-- post_analytics: Clean up
DROP POLICY IF EXISTS "Users can view analytics for their posts" ON public.post_analytics;

-- post_performance: Clean up
DROP POLICY IF EXISTS "Users can view performance of their posts" ON public.post_performance;

-- posts: Clean up
DROP POLICY IF EXISTS "Users can manage own posts" ON public.posts;

-- scheduled_content: Clean up
DROP POLICY IF EXISTS "Users can insert their own scheduled content" ON public.scheduled_content;
DROP POLICY IF EXISTS "Users can manage their scheduled content" ON public.scheduled_content;

-- social_accounts: Clean up
DROP POLICY IF EXISTS "Users can manage their social accounts" ON public.social_accounts;

-- social_posts: Clean up
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.social_posts;
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.social_posts;

-- user_preferences: Clean up
DROP POLICY IF EXISTS "Users can manage their preferences" ON public.user_preferences;

-- user_subscriptions: Clean up
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;

-- usage_records: Clean up
DROP POLICY IF EXISTS "Users can view their usage" ON public.usage_records;

-- website_crawls: Clean up
DROP POLICY IF EXISTS "Users can view their own crawls" ON public.website_crawls;
DROP POLICY IF EXISTS "Users can insert their own crawls" ON public.website_crawls;

-- ============================================================================
-- DONE - Duplicate policies removed, keeping only optimized versions
-- ============================================================================
