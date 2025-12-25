-- ============================================================================
-- OPTIMIZE SERVICE ROLE POLICIES
-- Wrap auth.role() with (select auth.role()) for performance
-- ============================================================================

-- analytics table - "Service inserts analytics" policy
DROP POLICY IF EXISTS "Service inserts analytics" ON public.analytics;
CREATE POLICY "Service inserts analytics" ON public.analytics FOR INSERT WITH CHECK ((select auth.role()) = 'service_role');

-- billing_events table - "Service inserts billing" policy
DROP POLICY IF EXISTS "Service inserts billing" ON public.billing_events;
CREATE POLICY "Service inserts billing" ON public.billing_events FOR INSERT WITH CHECK ((select auth.role()) = 'service_role');

-- usage_records table - "Service inserts usage" policy
DROP POLICY IF EXISTS "Service inserts usage" ON public.usage_records;
CREATE POLICY "Service inserts usage" ON public.usage_records FOR INSERT WITH CHECK ((select auth.role()) = 'service_role');

-- email_engagement table - "Service operations" policy
DROP POLICY IF EXISTS "Service operations" ON public.email_engagement;
CREATE POLICY "Service operations" ON public.email_engagement FOR INSERT WITH CHECK ((select auth.role()) = 'service_role');

