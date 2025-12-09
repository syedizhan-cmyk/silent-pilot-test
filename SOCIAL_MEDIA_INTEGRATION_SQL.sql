-- Social Media Integration Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the required tables

-- Social Posts table (for tracking all posts)
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[],
  post_id TEXT, -- Platform's post ID
  post_url TEXT, -- Direct URL to the post
  status TEXT DEFAULT 'draft', -- draft, scheduled, published, failed
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_account_id ON social_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_for ON social_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);

-- Post Analytics table (for tracking engagement)
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  views INT DEFAULT 0,
  clicks INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_fetched_at ON post_analytics(fetched_at);

-- Social account metadata update (add new columns if they don't exist)
ALTER TABLE social_accounts 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'unknown', -- valid, expired, error
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_social_posts_updated_at ON social_posts;
CREATE TRIGGER update_social_posts_updated_at
    BEFORE UPDATE ON social_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_post_analytics_updated_at ON post_analytics;
CREATE TRIGGER update_post_analytics_updated_at
    BEFORE UPDATE ON post_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;
CREATE TRIGGER update_social_accounts_updated_at
    BEFORE UPDATE ON social_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;

-- Social posts policies
DROP POLICY IF EXISTS "Users can view their own posts" ON social_posts;
CREATE POLICY "Users can view their own posts" ON social_posts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own posts" ON social_posts;
CREATE POLICY "Users can insert their own posts" ON social_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON social_posts;
CREATE POLICY "Users can update their own posts" ON social_posts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON social_posts;
CREATE POLICY "Users can delete their own posts" ON social_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Post analytics policies (users can view analytics for their posts)
DROP POLICY IF EXISTS "Users can view analytics for their posts" ON post_analytics;
CREATE POLICY "Users can view analytics for their posts" ON post_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM social_posts 
            WHERE social_posts.id = post_analytics.post_id 
            AND social_posts.user_id = auth.uid()
        )
    );

-- Grant necessary permissions
GRANT ALL ON social_posts TO authenticated;
GRANT ALL ON post_analytics TO authenticated;
GRANT ALL ON social_accounts TO authenticated;

-- Create a view for post performance summary
CREATE OR REPLACE VIEW post_performance_summary AS
SELECT 
    sp.id,
    sp.user_id,
    sp.platform,
    sp.content,
    sp.published_at,
    sp.status,
    COALESCE(pa.likes, 0) as likes,
    COALESCE(pa.comments, 0) as comments,
    COALESCE(pa.shares, 0) as shares,
    COALESCE(pa.views, 0) as views,
    COALESCE(pa.engagement_rate, 0) as engagement_rate,
    COALESCE(pa.reach, 0) as reach
FROM social_posts sp
LEFT JOIN LATERAL (
    SELECT * FROM post_analytics 
    WHERE post_id = sp.id 
    ORDER BY fetched_at DESC 
    LIMIT 1
) pa ON true
WHERE sp.status = 'published';

-- Grant access to the view
GRANT SELECT ON post_performance_summary TO authenticated;

-- Function to schedule a post
CREATE OR REPLACE FUNCTION schedule_social_post(
    p_user_id UUID,
    p_account_ids UUID[],
    p_content TEXT,
    p_media_urls TEXT[],
    p_scheduled_for TIMESTAMPTZ
)
RETURNS UUID[] AS $$
DECLARE
    v_account_id UUID;
    v_account RECORD;
    v_post_ids UUID[] := ARRAY[]::UUID[];
    v_post_id UUID;
BEGIN
    -- Loop through each account and create a scheduled post
    FOREACH v_account_id IN ARRAY p_account_ids
    LOOP
        -- Get account details
        SELECT * INTO v_account 
        FROM social_accounts 
        WHERE id = v_account_id 
        AND user_id = p_user_id 
        AND is_active = true;
        
        IF FOUND THEN
            -- Insert scheduled post
            INSERT INTO social_posts (
                user_id,
                account_id,
                platform,
                content,
                media_urls,
                status,
                scheduled_for
            ) VALUES (
                p_user_id,
                v_account_id,
                v_account.platform,
                p_content,
                p_media_urls,
                'scheduled',
                p_scheduled_for
            )
            RETURNING id INTO v_post_id;
            
            v_post_ids := array_append(v_post_ids, v_post_id);
        END IF;
    END LOOP;
    
    RETURN v_post_ids;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's social media stats
CREATE OR REPLACE FUNCTION get_user_social_stats(p_user_id UUID)
RETURNS TABLE (
    total_posts BIGINT,
    total_likes BIGINT,
    total_comments BIGINT,
    total_shares BIGINT,
    avg_engagement_rate DECIMAL,
    platforms_connected INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT sp.id)::BIGINT as total_posts,
        COALESCE(SUM(pa.likes), 0)::BIGINT as total_likes,
        COALESCE(SUM(pa.comments), 0)::BIGINT as total_comments,
        COALESCE(SUM(pa.shares), 0)::BIGINT as total_shares,
        COALESCE(AVG(pa.engagement_rate), 0)::DECIMAL as avg_engagement_rate,
        COUNT(DISTINCT sa.platform)::INT as platforms_connected
    FROM social_accounts sa
    LEFT JOIN social_posts sp ON sa.id = sp.account_id AND sp.status = 'published'
    LEFT JOIN post_analytics pa ON sp.id = pa.post_id
    WHERE sa.user_id = p_user_id AND sa.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE social_posts IS 'Stores all social media posts created through the platform';
COMMENT ON TABLE post_analytics IS 'Stores engagement metrics for published posts';
COMMENT ON COLUMN social_accounts.metadata IS 'Platform-specific account data and settings';
COMMENT ON COLUMN social_accounts.validation_status IS 'Current validation status of the account token';
COMMENT ON FUNCTION schedule_social_post IS 'Creates scheduled posts for multiple social accounts';
COMMENT ON FUNCTION get_user_social_stats IS 'Returns aggregated social media statistics for a user';
