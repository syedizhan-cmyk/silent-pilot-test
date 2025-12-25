-- ============================================================================
-- DROP DUPLICATE INDEXES
-- Performance optimization: Remove duplicate indexes
-- ============================================================================

-- ai_learning_data: Drop idx_ai_learning_user_id, keep idx_ai_learning_data_user_id
DROP INDEX IF EXISTS idx_ai_learning_user_id;

-- autopilot_settings: Drop autopilot_settings_user_id_idx, keep idx_autopilot_settings_user_id
DROP INDEX IF EXISTS autopilot_settings_user_id_idx;

-- business_profiles: Drop business_profiles_user_id_idx, keep idx_business_profiles_user_id
DROP INDEX IF EXISTS business_profiles_user_id_idx;

-- content_ideas: Drop content_ideas_user_id_idx, keep idx_content_ideas_user_id
DROP INDEX IF EXISTS content_ideas_user_id_idx;

-- scheduled_content: Drop scheduled_content_user_id_idx, keep idx_scheduled_content_user_id
DROP INDEX IF EXISTS scheduled_content_user_id_idx;

-- ============================================================================
-- DONE - All duplicate indexes removed
-- ============================================================================
