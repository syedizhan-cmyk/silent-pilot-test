-- ============================================================================
-- FIND AND FIX ALL SECURITY DEFINER VIEWS
-- ============================================================================

-- This query will show us all views with SECURITY DEFINER
-- SELECT schemaname, viewname 
-- FROM pg_views 
-- WHERE definition ILIKE '%SECURITY DEFINER%'
-- AND schemaname = 'public';

-- Drop the problematic view completely
DROP VIEW IF EXISTS public.post_performance_summary CASCADE;

-- Recreate it as a simple view without any SECURITY DEFINER
-- Using a basic definition that doesn't include SECURITY DEFINER
CREATE VIEW public.post_performance_summary WITH (security_barrier=false) AS
SELECT 
  p.id,
  p.user_id,
  p.platform,
  p.content,
  p.published_at,
  p.status,
  COALESCE(pp.likes, 0) as likes,
  COALESCE(pp.comments, 0) as comments,
  COALESCE(pp.shares, 0) as shares,
  COALESCE(pp.reach, 0) as reach,
  COALESCE(pp.impressions, 0) as impressions,
  COALESCE(pp.clicks, 0) as clicks,
  COALESCE(pp.engagement_rate, 0::numeric) as engagement_rate,
  COALESCE(pp.click_through_rate, 0::numeric) as click_through_rate,
  pp.updated_at
FROM public.posts p
LEFT JOIN public.post_performance pp ON p.id = pp.post_id;

-- Alternative: If the above doesn't work, try this ultra-minimal version
-- DROP VIEW IF EXISTS public.post_performance_summary CASCADE;
-- CREATE VIEW public.post_performance_summary AS SELECT * FROM public.posts LIMIT 0;

