-- Add discovery metadata fields to business_profiles table
-- These fields store information about automated business discovery

ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS discovery_sources TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS discovery_confidence INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT '{}';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_business_profiles_discovery 
ON business_profiles(user_id, discovery_confidence);

-- Add comments for documentation
COMMENT ON COLUMN business_profiles.discovery_sources IS 'Array of data sources used for business discovery (website, google, yelp, ai_analysis)';
COMMENT ON COLUMN business_profiles.discovery_confidence IS 'Confidence score (0-100) indicating quality of discovered data';
COMMENT ON COLUMN business_profiles.platforms IS 'Array of social media platforms the business uses';
