-- Add brand colors and logo to business profiles
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS brand_colors JSONB DEFAULT '{"primary": "#007bff", "secondary": "#6c757d", "accent": "#28a745"}',
ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN business_profiles.brand_colors IS 'Brand color palette with primary, secondary, and accent colors';
COMMENT ON COLUMN business_profiles.logo_url IS 'URL to business logo image';
