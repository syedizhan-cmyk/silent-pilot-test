-- ============================================================================
-- ADD PERFORMANCE INDEXES - ULTRA SAFE VERSION
-- Only the most common indexes that should exist
-- ============================================================================

-- Core tables with user_id (most likely to exist)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);

-- Timestamp indexes (these columns are more likely to exist)
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at ON public.email_campaigns(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at DESC);

-- Status index (common column name)
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON public.ai_generations(status);
