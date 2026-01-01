-- Fix RLS policies for business_profiles table
-- Allow authenticated users to read and write their own profiles

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON business_profiles;

-- Enable RLS
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile"
  ON business_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON business_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON business_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON business_profiles
  FOR DELETE
  USING (auth.uid() = user_id);
