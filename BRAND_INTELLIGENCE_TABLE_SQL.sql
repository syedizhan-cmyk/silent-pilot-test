-- Create brand_intelligence table for storing enriched business data
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.brand_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enriched_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_intelligence_user_id ON public.brand_intelligence(user_id);

-- Enable Row Level Security
ALTER TABLE public.brand_intelligence ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own brand intelligence
CREATE POLICY "Users can view their own brand intelligence"
  ON public.brand_intelligence
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own brand intelligence
CREATE POLICY "Users can insert their own brand intelligence"
  ON public.brand_intelligence
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own brand intelligence
CREATE POLICY "Users can update their own brand intelligence"
  ON public.brand_intelligence
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own brand intelligence
CREATE POLICY "Users can delete their own brand intelligence"
  ON public.brand_intelligence
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE public.brand_intelligence IS 'Stores enriched brand intelligence data gathered from web crawling and AI analysis';
