-- Website Crawler Tables

-- Table to store website crawl results
CREATE TABLE IF NOT EXISTS website_crawls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  content_extracted JSONB DEFAULT '{}',
  ai_analysis JSONB DEFAULT '{}',
  crawled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_website_crawls_user_id ON website_crawls(user_id);
CREATE INDEX IF NOT EXISTS idx_website_crawls_crawled_at ON website_crawls(crawled_at DESC);

-- RLS Policies
ALTER TABLE website_crawls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own crawls" ON website_crawls;
CREATE POLICY "Users can view their own crawls" ON website_crawls
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own crawls" ON website_crawls;
CREATE POLICY "Users can insert their own crawls" ON website_crawls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON website_crawls TO authenticated;

-- Add website_url to business profile for easy access
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS website_url TEXT;

COMMENT ON TABLE website_crawls IS 'Stores results from crawling business websites for content ideas';
