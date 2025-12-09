-- AI Media Studio Tables
-- Run this in your Supabase SQL Editor

-- Create media_library table for uploaded media
CREATE TABLE IF NOT EXISTS public.media_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'image', 'video', 'audio'
  size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generated_media table for AI generated images
CREATE TABLE IF NOT EXISTS public.generated_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  style TEXT,
  size TEXT,
  quality TEXT,
  provider TEXT, -- 'openai', 'stability', 'midjourney', etc.
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_generations table for generation history
CREATE TABLE IF NOT EXISTS public.ai_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image', 'text', 'video'
  prompt TEXT NOT NULL,
  result TEXT,
  provider TEXT,
  settings JSONB,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- Create policies for media_library
CREATE POLICY "Users can view their own media"
  ON public.media_library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
  ON public.media_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media"
  ON public.media_library FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
  ON public.media_library FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for generated_media
CREATE POLICY "Users can view their own generated media"
  ON public.generated_media FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generated media"
  ON public.generated_media FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generated media"
  ON public.generated_media FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for ai_generations
CREATE POLICY "Users can view their own generations"
  ON public.ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations"
  ON public.ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
  ON public.ai_generations FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_library_user_id ON public.media_library(user_id);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON public.media_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_media_user_id ON public.generated_media(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_media_created_at ON public.generated_media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_status ON public.ai_generations(status);
