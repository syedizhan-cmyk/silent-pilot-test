-- Force schema reload
SELECT pg_notify('pgrst', 'reload schema');

-- Also verify tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('media_library', 'generated_media', 'ai_generations')
ORDER BY table_name;
