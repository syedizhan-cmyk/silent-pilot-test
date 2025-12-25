-- ============================================================================
-- REMOVE SECURITY DEFINER FROM ALL VIEWS
-- Security optimization: Views should use INVOKER (default), not SECURITY DEFINER
-- ============================================================================

-- Find and recreate views without SECURITY DEFINER
-- Note: We need to drop and recreate views to remove SECURITY DEFINER

-- Get the definition of post_performance_summary and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.post_performance_summary CASCADE;

-- Recreate without SECURITY DEFINER
CREATE VIEW public.post_performance_summary AS
SELECT 
  p.id,
  p.user_id,
  p.platform,
  p.content,
  p.published_at,
  p.status,
  COALESCE(pa.likes, 0) as likes,
  COALESCE(pa.comments, 0) as comments,
  COALESCE(pa.shares, 0) as shares,
  COALESCE(pa.views, 0) as views,
  COALESCE(pa.engagement_rate, 0) as engagement_rate,
  COALESCE(pa.reach, 0) as reach
FROM public.posts p
LEFT JOIN public.post_analytics pa ON p.id = pa.post_id;

-- Check for any other views with SECURITY DEFINER and document them
-- Run this query to find all SECURITY DEFINER views:
-- SELECT schemaname, viewname, definition FROM pg_views WHERE definition ILIKE '%SECURITY DEFINER%';

-- Note: If there are other SECURITY DEFINER views, they will need to be manually recreated
-- using the same pattern above (DROP VIEW, then CREATE VIEW without SECURITY DEFINER)

