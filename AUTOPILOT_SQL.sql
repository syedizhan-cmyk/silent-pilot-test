-- Auto-Pilot System Tables
-- Run this SQL in your Supabase SQL Editor

-- 1. Auto-Pilot Settings Table
CREATE TABLE IF NOT EXISTS autopilot_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Scheduled Content Table
CREATE TABLE IF NOT EXISTS scheduled_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  platform TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled, published, failed, pending
  type TEXT, -- post, carousel, video, etc.
  engagement JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- 3. Content Ideas Table (for tracking generated ideas)
CREATE TABLE IF NOT EXISTS content_ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  type TEXT,
  platform TEXT,
  message TEXT,
  cta TEXT,
  status TEXT DEFAULT 'pending', -- pending, generated, used
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE autopilot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;

-- Policies for autopilot_settings
CREATE POLICY "Users can view their own autopilot settings"
  ON autopilot_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own autopilot settings"
  ON autopilot_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own autopilot settings"
  ON autopilot_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for scheduled_content
CREATE POLICY "Users can view their own scheduled content"
  ON scheduled_content FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled content"
  ON scheduled_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled content"
  ON scheduled_content FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled content"
  ON scheduled_content FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for content_ideas
CREATE POLICY "Users can view their own content ideas"
  ON content_ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content ideas"
  ON content_ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content ideas"
  ON content_ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content ideas"
  ON content_ideas FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS autopilot_settings_user_id_idx ON autopilot_settings(user_id);
CREATE INDEX IF NOT EXISTS scheduled_content_user_id_idx ON scheduled_content(user_id);
CREATE INDEX IF NOT EXISTS scheduled_content_scheduled_for_idx ON scheduled_content(scheduled_for);
CREATE INDEX IF NOT EXISTS content_ideas_user_id_idx ON content_ideas(user_id);

-- Add updated_at trigger for autopilot_settings
CREATE OR REPLACE FUNCTION update_autopilot_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER autopilot_settings_updated_at
  BEFORE UPDATE ON autopilot_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_autopilot_settings_updated_at();