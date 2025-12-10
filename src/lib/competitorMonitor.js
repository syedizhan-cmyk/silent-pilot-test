// Competitor Monitoring System
// Track competitor social media and identify opportunities

import { generateContentWithGemini } from './gemini';
import { supabase } from './supabase';

/**
 * Analyze competitor's social media presence
 * @param {string} competitorName - Competitor business name
 * @param {string} industry - Industry
 * @param {array} platforms - Platforms to monitor
 * @returns {Promise<object>} Competitor analysis
 */
export async function analyzeCompetitor(competitorName, industry, platforms = []) {
  try {
    console.log(`🔍 Analyzing competitor: ${competitorName}`);
    
    // Use AI to research competitor
    const prompt = `Analyze this competitor's social media strategy:

Competitor: ${competitorName}
Industry: ${industry}
Platforms: ${platforms.join(', ')}

Provide analysis on:
1. Content strategy (what they post about)
2. Posting frequency
3. Engagement tactics
4. Strengths (what they do well)
5. Weaknesses/gaps (opportunities for us)
6. Key themes and topics
7. Audience engagement level

Format as structured analysis with clear sections.`;

    const analysis = await generateContentWithGemini(prompt, 'analysis', { industry });
    
    return {
      success: true,
      competitor: competitorName,
      industry: industry,
      platforms: platforms,
      analysis: analysis,
      analyzedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error analyzing competitor:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Identify content gaps (what competitors aren't doing)
 * @param {object} businessProfile - User's business profile
 * @param {array} competitors - List of competitors
 * @returns {Promise<array>} Content opportunities
 */
export async function identifyContentGaps(businessProfile, competitors = []) {
  try {
    console.log('🎯 Identifying content gaps and opportunities...');
    
    const competitorList = competitors.join(', ') || 'industry competitors';
    
    const prompt = `Identify content opportunities and gaps in the market:

Our Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Our Products/Services: ${businessProfile.productsServices}
Competitors: ${competitorList}

Analyze and identify:
1. Topics competitors are NOT covering (content gaps)
2. Underserved audience segments
3. Trending topics in the industry
4. Questions customers are asking
5. Unique angles we can take
6. Content formats that are underutilized
7. Seasonal opportunities

Provide 10 specific, actionable content ideas that fill these gaps.
Format as numbered list with brief explanation for each.`;

    const response = await generateContentWithGemini(prompt, 'analysis', businessProfile);
    
    // Parse opportunities
    const opportunities = response
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line))
      .map(line => {
        const match = line.match(/^\d+\.\s*(.+)/);
        return match ? match[1].trim() : line.trim();
      });
    
    return opportunities.slice(0, 10);
    
  } catch (error) {
    console.error('Error identifying content gaps:', error);
    return [];
  }
}

/**
 * Monitor competitor posting activity
 * @param {string} userId - User ID
 * @param {string} competitorId - Competitor ID
 * @param {object} activity - Activity data
 */
export async function logCompetitorActivity(userId, competitorId, activity) {
  try {
    const { error } = await supabase
      .from('competitor_activity')
      .insert({
        user_id: userId,
        competitor_id: competitorId,
        platform: activity.platform,
        post_type: activity.type,
        engagement: activity.engagement || 0,
        content_preview: activity.content?.substring(0, 200),
        posted_at: activity.postedAt || new Date().toISOString(),
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error logging competitor activity:', error);
  }
}

/**
 * Get competitor insights
 * @param {string} userId - User ID
 * @param {number} days - Days to look back
 */
export async function getCompetitorInsights(userId, days = 30) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('competitor_activity')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', daysAgo.toISOString())
      .order('engagement', { ascending: false });
    
    if (error) throw error;
    
    // Analyze patterns
    const insights = [];
    
    if (data && data.length > 0) {
      // Most common post types
      const typeCounts = {};
      data.forEach(item => {
        typeCounts[item.post_type] = (typeCounts[item.post_type] || 0) + 1;
      });
      
      const mostCommon = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (mostCommon) {
        insights.push({
          type: 'competitor_strategy',
          message: `Competitors are posting ${mostCommon[0]} content ${mostCommon[1]} times`,
          recommendation: `Consider creating more ${mostCommon[0]} content to compete`,
          priority: 'medium'
        });
      }
      
      // High engagement posts
      const topPosts = data.slice(0, 3);
      if (topPosts.length > 0) {
        insights.push({
          type: 'high_performing',
          message: `Competitors getting high engagement on ${topPosts[0].post_type} posts`,
          recommendation: `Create similar content with your unique angle`,
          priority: 'high'
        });
      }
    }
    
    return {
      insights,
      totalActivity: data?.length || 0,
      topPosts: data?.slice(0, 5) || []
    };
    
  } catch (error) {
    console.error('Error getting competitor insights:', error);
    return { insights: [], totalActivity: 0, topPosts: [] };
  }
}

/**
 * Suggest competitive advantages
 * @param {object} businessProfile - Business profile
 * @param {object} competitorData - Competitor analysis
 * @returns {Promise<array>} Advantages to emphasize
 */
export async function suggestCompetitiveAdvantages(businessProfile, competitorData = {}) {
  try {
    const prompt = `Identify our competitive advantages and how to emphasize them in marketing:

Our Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Products/Services: ${businessProfile.productsServices}
Location: ${businessProfile.city}, ${businessProfile.state}
Unique Value: ${businessProfile.uniqueValue || 'N/A'}

Competitor weaknesses: ${competitorData.weaknesses || 'Not specified'}

Provide:
1. Our top 5 competitive advantages
2. How to emphasize each in social media
3. Content angles that highlight these advantages
4. Messaging suggestions

Format as actionable list.`;

    const response = await generateContentWithGemini(prompt, 'analysis', businessProfile);
    
    return {
      success: true,
      advantages: response,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error suggesting advantages:', error);
    return { success: false, advantages: '' };
  }
}

/**
 * Track competitor mentions and brand sentiment
 * @param {string} userId - User ID
 * @param {string} keyword - Keyword to track
 * @param {string} sentiment - positive/negative/neutral
 */
export async function trackBrandMention(userId, keyword, sentiment = 'neutral') {
  try {
    const { error } = await supabase
      .from('brand_mentions')
      .insert({
        user_id: userId,
        keyword: keyword,
        sentiment: sentiment,
        source: 'competitor_monitor',
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error tracking mention:', error);
  }
}

/**
 * Get sentiment analysis summary
 * @param {string} userId - User ID
 * @param {number} days - Days to analyze
 */
export async function getSentimentSummary(userId, days = 30) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('brand_mentions')
      .select('sentiment')
      .eq('user_id', userId)
      .gte('created_at', daysAgo.toISOString());
    
    if (error) throw error;
    
    const counts = {
      positive: 0,
      negative: 0,
      neutral: 0,
      total: data?.length || 0
    };
    
    (data || []).forEach(mention => {
      counts[mention.sentiment] = (counts[mention.sentiment] || 0) + 1;
    });
    
    const positiveRate = counts.total > 0 
      ? Math.round((counts.positive / counts.total) * 100) 
      : 0;
    
    return {
      ...counts,
      positiveRate,
      trend: positiveRate > 60 ? 'positive' : positiveRate < 40 ? 'negative' : 'neutral'
    };
    
  } catch (error) {
    console.error('Error getting sentiment:', error);
    return { positive: 0, negative: 0, neutral: 0, total: 0, positiveRate: 0, trend: 'neutral' };
  }
}

export default {
  analyzeCompetitor,
  identifyContentGaps,
  logCompetitorActivity,
  getCompetitorInsights,
  suggestCompetitiveAdvantages,
  trackBrandMention,
  getSentimentSummary
};
