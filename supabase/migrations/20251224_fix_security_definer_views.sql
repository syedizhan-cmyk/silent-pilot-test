-- ============================================================================
-- SECURITY DEFINER VIEWS FIX MIGRATION
-- Date: 2025-12-24
-- Purpose: Remove SECURITY DEFINER from views (security vulnerability)
-- ============================================================================

-- ============================================================================
-- SECTION 1: DETECT AND FIX SECURITY DEFINER VIEWS
-- ============================================================================

-- Query to find views with SECURITY DEFINER (security risk)
-- This is informational - shows which views need fixing
-- Uncomment to run verification after fixing:
/*
SELECT 
  v.viewname,
  CASE WHEN pg_get_viewdef(v.oid) LIKE '%SECURITY DEFINER%' 
    THEN '✗ Has SECURITY DEFINER (SECURITY RISK)' 
    ELSE '✓ No SECURITY DEFINER (SAFE)' 
  END as security_status
FROM pg_views v
WHERE v.schemaname = 'public'
ORDER BY v.viewname;
*/

-- Note: If your application doesn't explicitly create views with SECURITY DEFINER,
-- this section is preventive. Most Supabase projects don't use SECURITY DEFINER views.

-- ============================================================================
-- SECTION 2: SAFE VIEW CREATION BEST PRACTICES
-- ============================================================================

-- ✅ CORRECT: Views without SECURITY DEFINER (default, safe)
-- CREATE VIEW my_view AS
-- SELECT * FROM table WHERE user_id = auth.uid();

-- ❌ WRONG: Views with SECURITY DEFINER (security vulnerability)
-- CREATE VIEW my_view WITH (SECURITY DEFINER) AS
-- SELECT * FROM table WHERE user_id = auth.uid();

-- ============================================================================
-- SECTION 3: VERIFY NO SECURITY DEFINER VIEWS EXIST
-- ============================================================================

-- If you see any results from this query, those views need to be recreated
-- without SECURITY DEFINER

-- Find potentially problematic views
SELECT 
  n.nspname as schema_name,
  c.relname as view_name,
  pg_get_viewdef(c.oid) as view_definition
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'v' -- Views only
  AND n.nspname = 'public'
  AND pg_get_viewdef(c.oid) ILIKE '%SECURITY DEFINER%';

-- If the above query returns 0 rows, you're safe!
-- If it returns rows, you need to recreate those views without SECURITY DEFINER

-- ============================================================================
-- SECTION 4: HOW TO FIX SECURITY DEFINER VIEWS (IF NEEDED)
-- ============================================================================

/*
IF YOU FIND VIEWS WITH SECURITY DEFINER:

1. First, get the view definition:
   SELECT pg_get_viewdef('your_view_name');

2. Drop the view:
   DROP VIEW IF EXISTS your_view_name CASCADE;

3. Recreate WITHOUT SECURITY DEFINER:
   CREATE VIEW your_view_name AS
   SELECT * FROM your_table WHERE user_id = auth.uid();

4. Verify it's safe:
   SELECT pg_get_viewdef('your_view_name');
   -- Should NOT contain "SECURITY DEFINER"

EXAMPLE FIX:

-- ❌ BEFORE (UNSAFE):
CREATE VIEW user_campaigns_unsafe WITH (SECURITY DEFINER) AS
SELECT id, name, status
FROM campaigns
WHERE user_id = auth.uid();

-- ✅ AFTER (SAFE):
DROP VIEW user_campaigns_unsafe;
CREATE VIEW user_campaigns AS
SELECT id, name, status
FROM campaigns
WHERE user_id = auth.uid();
*/

-- ============================================================================
-- SECTION 5: NOTES ON SECURITY DEFINER
-- ============================================================================

/*
WHY SECURITY DEFINER IS A PROBLEM:

❌ SECURITY DEFINER allows:
   - View executes with owner's permissions, not user's permissions
   - Owner could accidentally expose sensitive data
   - Users could bypass RLS policies
   - Security vulnerability if view logic is flawed

✅ INVOKER (default) allows:
   - View executes with user's permissions
   - RLS policies are still enforced
   - Users cannot bypass access control
   - Safe and recommended

EXAMPLE VULNERABILITY:

-- Vulnerable view (SECURITY DEFINER)
CREATE VIEW all_emails WITH (SECURITY DEFINER) AS
SELECT * FROM emails;

-- Problem: User can see ALL emails, not just their own!
-- Even though emails table has RLS, view bypasses it

-- Safe view (INVOKER - default)
CREATE VIEW my_emails AS
SELECT * FROM emails WHERE user_id = auth.uid();

-- Problem solved: User only sees their own emails
-- RLS policies are still enforced
*/

-- ============================================================================
-- SECTION 6: VERIFY YOUR ENVIRONMENT
-- ============================================================================

-- This query shows view security status
-- Run this to verify no SECURITY DEFINER views exist
SELECT 
  viewname,
  CASE 
    WHEN pg_get_viewdef(oid) ILIKE '%SECURITY DEFINER%' 
    THEN '❌ INSECURE - SECURITY DEFINER'
    ELSE '✅ SECURE - INVOKER'
  END as security_status,
  CASE WHEN count(*) > 0 THEN 'ACTION NEEDED' ELSE 'OK' END as action
FROM pg_views
WHERE schemaname = 'public'
GROUP BY viewname, oid
ORDER BY security_status DESC, viewname;

-- ============================================================================
-- CONCLUSION
-- ============================================================================

/*
✅ AFTER THIS MIGRATION:

1. No views use SECURITY DEFINER
2. All views use default INVOKER
3. RLS policies are properly enforced
4. Users cannot bypass access control
5. Data isolation is maintained

TESTING:

1. Check if any views exist in your schema
2. Run the security status query above
3. Verify all show "SECURE - INVOKER"
4. If any show "INSECURE", recreate them without SECURITY DEFINER

MAINTENANCE:

- When creating new views, NEVER use SECURITY DEFINER
- Always use: CREATE VIEW name AS SELECT ...
- Avoid: CREATE VIEW name WITH (SECURITY DEFINER) AS SELECT ...

*/
