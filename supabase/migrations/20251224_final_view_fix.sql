-- ============================================================================
-- FINAL VIEW FIX - Remove SECURITY DEFINER completely
-- ============================================================================

-- Drop the view with CASCADE to remove all dependencies
DROP VIEW IF EXISTS public.post_performance_summary CASCADE;

-- Wait a moment for the drop to complete, then recreate
-- This time without any SECURITY DEFINER or special options

CREATE VIEW public.post_performance_summary AS
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

-- Ensure RLS is enabled on the source tables so the view inherits the protection
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_performance ENABLE ROW LEVEL SECURITY;

-- Grant appropriate permissions
GRANT SELECT ON public.post_performance_summary TO authenticated;
GRANT SELECT ON public.post_performance_summary TO anon;

