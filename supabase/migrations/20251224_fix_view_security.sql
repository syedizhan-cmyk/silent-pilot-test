-- ============================================================================
-- FIX VIEW SECURITY DEFINER - Direct recreation
-- ============================================================================

-- First, get the view definition to understand its structure
-- Then drop and recreate without SECURITY DEFINER

DROP VIEW IF EXISTS public.post_performance_summary CASCADE;

-- Recreate the view WITHOUT any SECURITY DEFINER clause
CREATE OR REPLACE VIEW public.post_performance_summary AS
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
  COALESCE(pp.engagement_rate, 0) as engagement_rate,
  COALESCE(pp.click_through_rate, 0) as click_through_rate,
  pp.updated_at
FROM public.posts p
LEFT JOIN public.post_performance pp ON p.id = pp.post_id;

-- Grant permissions on the view
GRANT SELECT ON public.post_performance_summary TO authenticated;
GRANT SELECT ON public.post_performance_summary TO anon;

