-- ============================================================================
-- DIAGNOSTIC QUERY - See your actual table structure
-- ============================================================================

-- Run this to see all columns in public tables
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
