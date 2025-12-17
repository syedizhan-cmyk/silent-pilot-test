-- SQL Schema for Email Marketing Automation & A/B Testing
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- EMAIL MARKETING TABLES
-- ============================================================================

-- Email Campaigns
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  objective VARCHAR(100), -- 'sales', 'engagement', 'awareness', etc.
  type VARCHAR(100), -- 'newsletter', 'promo', 'transactional', etc.
  subject VARCHAR(255),
  preview_text TEXT,
  body TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'paused'
  sent_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  optimization_notes TEXT,
  last_optimized TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Campaign Variants (for A/B testing)
CREATE TABLE IF NOT EXISTS email_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  subject VARCHAR(255),
  preview_text TEXT,
  body TEXT,
  hypothesis TEXT,
  traffic_percentage INTEGER DEFAULT 33,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Subscribers
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'unsubscribed', 'bounced'
  segment VARCHAR(100), -- 'highly_engaged', 'moderate', 'cold'
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  last_engaged TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, email)
);

-- Email Engagement History
CREATE TABLE IF NOT EXISTS email_engagement (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES email_subscribers(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  last_engaged TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- A/B TESTING TABLES
-- ============================================================================

-- A/B Tests for Social Media
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  original_content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused'
  winner_variant_id UUID,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test Variants
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_name VARCHAR(100) NOT NULL,
  variant_index INTEGER,
  content TEXT NOT NULL,
  hypothesis TEXT,
  traffic_allocation DECIMAL(5,2) DEFAULT 33.33,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post Performance (for learning)
CREATE TABLE IF NOT EXISTS post_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES scheduled_content(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  click_through_rate DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id)
);

-- AI Learning Data (stores what AI learns)
CREATE TABLE IF NOT EXISTS ai_learning_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL, -- 'post_performance', 'email_insights', etc.
  platform VARCHAR(50),
  metrics JSONB,
  insights JSONB,
  performance_score DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Optimization Rules (generated rules from learning)
CREATE TABLE IF NOT EXISTS ai_optimization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rules JSONB NOT NULL,
  patterns JSONB,
  sample_size INTEGER,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Preferences (learned preferences)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_preferences JSONB,
  timing_preferences JSONB,
  platform_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_email_campaigns_user_id ON email_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_variants_campaign_id ON email_variants(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_status ON email_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_email_engagement_subscriber_id ON email_engagement(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_test_variants_test_id ON ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_post_performance_post_id ON post_performance(post_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_user_id ON ai_learning_data(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_learning_type ON ai_learning_data(data_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Email Campaigns RLS
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own campaigns"
  ON email_campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON email_campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON email_campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON email_campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Email Variants RLS
ALTER TABLE email_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their campaign variants"
  ON email_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM email_campaigns
      WHERE email_campaigns.id = email_variants.campaign_id
      AND email_campaigns.user_id = auth.uid()
    )
  );

-- Email Subscribers RLS
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their subscribers"
  ON email_subscribers FOR ALL
  USING (auth.uid() = user_id);

-- A/B Tests RLS
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their A/B tests"
  ON ab_tests FOR ALL
  USING (auth.uid() = user_id);

-- A/B Test Variants RLS
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their test variants"
  ON ab_test_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM ab_tests
      WHERE ab_tests.id = ab_test_variants.test_id
      AND ab_tests.user_id = auth.uid()
    )
  );

-- Post Performance RLS
ALTER TABLE post_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view performance of their posts"
  ON post_performance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM scheduled_content
      WHERE scheduled_content.id = post_performance.post_id
      AND scheduled_content.user_id = auth.uid()
    )
  );

-- AI Learning Data RLS
ALTER TABLE ai_learning_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their learning data"
  ON ai_learning_data FOR ALL
  USING (auth.uid() = user_id);

-- AI Optimization Rules RLS
ALTER TABLE ai_optimization_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their optimization rules"
  ON ai_optimization_rules FOR ALL
  USING (auth.uid() = user_id);

-- User Preferences RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS FOR AUTO-UPDATES
-- ============================================================================

-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.impressions > 0 THEN
    NEW.engagement_rate = ((NEW.likes + NEW.shares + NEW.comments)::DECIMAL / NEW.impressions) * 100;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for ab_test_variants
CREATE TRIGGER update_variant_engagement
  BEFORE INSERT OR UPDATE ON ab_test_variants
  FOR EACH ROW
  EXECUTE FUNCTION calculate_engagement_rate();

-- Trigger for post_performance
CREATE TRIGGER update_post_engagement
  BEFORE INSERT OR UPDATE ON post_performance
  FOR EACH ROW
  EXECUTE FUNCTION calculate_engagement_rate();

-- Function to calculate email rates
CREATE OR REPLACE FUNCTION calculate_email_rates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sent_count > 0 THEN
    NEW.open_rate = (NEW.open_count::DECIMAL / NEW.sent_count) * 100;
    NEW.click_rate = (NEW.click_count::DECIMAL / NEW.sent_count) * 100;
    NEW.conversion_rate = (NEW.conversion_count::DECIMAL / NEW.sent_count) * 100;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for email_variants
CREATE TRIGGER update_email_variant_rates
  BEFORE INSERT OR UPDATE ON email_variants
  FOR EACH ROW
  EXECUTE FUNCTION calculate_email_rates();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment to add sample data for testing

/*
-- Sample email campaign
INSERT INTO email_campaigns (user_id, name, objective, type, subject, body, status)
VALUES (
  auth.uid(),
  'Welcome Series - Email 1',
  'engagement',
  'welcome',
  'Welcome to Silent Pilot! 🚀',
  'Hi there! We're excited to have you...',
  'draft'
);
*/

-- ============================================================================
-- COMPLETION
-- ============================================================================

-- Add comment for documentation
COMMENT ON TABLE email_campaigns IS 'Email marketing campaigns with A/B testing support';
COMMENT ON TABLE ab_tests IS 'A/B tests for social media posts';
COMMENT ON TABLE ai_learning_data IS 'Stores AI learning from campaign performance';
COMMENT ON TABLE ai_optimization_rules IS 'Auto-generated optimization rules based on learning';

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE 'Email Marketing & A/B Testing tables created successfully!';
  RAISE NOTICE 'All RLS policies enabled for security.';
  RAISE NOTICE 'Indexes created for optimal performance.';
END $$;
