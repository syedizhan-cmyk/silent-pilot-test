-- Add onboarding fields to business_profiles table
-- Migration: Add onboarding completion tracking and new fields

-- Add onboarding_completed flag
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS marketing_goals TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS monthly_budget TEXT,
ADD COLUMN IF NOT EXISTS marketing_challenges TEXT,
ADD COLUMN IF NOT EXISTS customer_age_range TEXT,
ADD COLUMN IF NOT EXISTS customer_location TEXT,
ADD COLUMN IF NOT EXISTS customer_interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pain_points TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_platforms TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS brand_colors JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create index for faster onboarding status checks
CREATE INDEX IF NOT EXISTS idx_business_profiles_onboarding 
ON business_profiles(user_id, onboarding_completed);

-- Add comment for documentation
COMMENT ON COLUMN business_profiles.onboarding_completed IS 'Whether user has completed initial onboarding flow';
COMMENT ON COLUMN business_profiles.onboarding_step IS 'Current step in onboarding process (0-5)';
COMMENT ON COLUMN business_profiles.marketing_goals IS 'Array of selected marketing goals';
COMMENT ON COLUMN business_profiles.monthly_budget IS 'Monthly marketing budget range';
COMMENT ON COLUMN business_profiles.marketing_challenges IS 'Current marketing challenges faced';
COMMENT ON COLUMN business_profiles.customer_age_range IS 'Target customer age range';
COMMENT ON COLUMN business_profiles.customer_location IS 'Target customer location/region';
COMMENT ON COLUMN business_profiles.customer_interests IS 'Array of customer interests';
COMMENT ON COLUMN business_profiles.pain_points IS 'Array of customer pain points';
COMMENT ON COLUMN business_profiles.preferred_platforms IS 'Array of preferred marketing platforms';
COMMENT ON COLUMN business_profiles.brand_colors IS 'JSON object containing brand color palette';
COMMENT ON COLUMN business_profiles.logo_url IS 'URL to uploaded logo in storage';
