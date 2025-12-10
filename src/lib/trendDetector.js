// Trend Detection System
// Identify trending topics and viral content opportunities

import { generateContentWithGemini } from './gemini';
import { supabase } from './supabase';

/**
 * Detect trending topics in industry
 * @param {string} industry - Industry to analyze
 * @param {string} location - Location for local trends
 * @returns {Promise<array>} Trending topics
 */
export async function detectTrendingTopics(industry, location = '') {
  try {
    console.log(`📈 Detecting trends for ${industry}...`);
    
    const prompt = `Identify current trending topics and conversations in the ${industry} industry ${location ? `in ${location}` : ''}.

Analyze:
1. What topics are trending RIGHT NOW
2. Popular hashtags gaining traction
3. Viral content formats working well
4. Seasonal opportunities this month
5. Emerging trends to get ahead of
6. Questions people are asking
7. News/events driving conversations

Provide 10 specific, actionable trending topics with:
- Topic name
- Why it's trending
- Content angle suggestion

Format as numbered list.`;

    const response = await generateContentWithGemini(prompt, 'analysis', { industry, location });
    
    // Parse trends
    const trends = [];
    const lines = response.split('\n').filter(line => line.trim());
    
    let currentTrend = null;
    lines.forEach(line => {
      if (/^\d+\./.test(line)) {
        if (currentTrend) {
          trends.push(currentTrend);
        }
        currentTrend = {
          topic: line.replace(/^\d+\.\s*/, '').trim(),
          details: '',
          detectedAt: new Date().toISOString()
        };
      } else if (currentTrend && line.trim()) {
        currentTrend.details += line + ' ';
      }
    });
    
    if (currentTrend) {
      trends.push(currentTrend);
    }
    
    return trends.slice(0, 10);
    
  } catch (error) {
    console.error('Error detecting trends:', error);
    return [];
  }
}

/**
 * Get seasonal marketing opportunities
 * @param {string} industry - Industry
 * @param {number} monthsAhead - Months to look ahead
 * @returns {Promise<array>} Seasonal opportunities
 */
export async function getSeasonalOpportunities(industry, monthsAhead = 3) {
  try {
    console.log(`🗓️ Finding seasonal opportunities for ${industry}...`);
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const prompt = `Identify seasonal marketing opportunities for the next ${monthsAhead} months:

Industry: ${industry}
Starting: ${currentMonth} ${currentYear}

For each of the next ${monthsAhead} months, identify:
1. Holidays and events relevant to this industry
2. Seasonal changes affecting the business
3. Content themes for each month
4. Promotional opportunities
5. Best timing for campaigns

Provide month-by-month breakdown with specific marketing opportunities.`;

    const response = await generateContentWithGemini(prompt, 'analysis', { industry });
    
    return {
      success: true,
      opportunities: response,
      industry: industry,
      monthsAhead: monthsAhead,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error getting seasonal opportunities:', error);
    return { success: false, opportunities: '' };
  }
}

/**
 * Analyze viral content patterns
 * @param {string} industry - Industry
 * @param {string} platform - Platform to analyze
 * @returns {Promise<object>} Viral content insights
 */
export async function analyzeViralPatterns(industry, platform = 'instagram') {
  try {
    console.log(`🔥 Analyzing viral content patterns for ${platform}...`);
    
    const prompt = `Analyze what makes content go viral on ${platform} in the ${industry} industry:

Identify:
1. Common elements in viral posts (format, style, length)
2. Optimal posting times for maximum reach
3. Hashtag strategies that work
4. Visual/content formats getting most engagement
5. Hooks and opening lines that grab attention
6. Call-to-action styles that drive engagement
7. Topics that resonate most with audience

Provide actionable insights we can apply to our content strategy.`;

    const response = await generateContentWithGemini(prompt, 'analysis', { industry, platform });
    
    return {
      success: true,
      platform: platform,
      insights: response,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error analyzing viral patterns:', error);
    return { success: false, insights: '' };
  }
}

/**
 * Track trending hashtags
 * @param {string} userId - User ID
 * @param {string} hashtag - Hashtag to track
 * @param {number} score - Trending score
 */
export async function trackTrendingHashtag(userId, hashtag, score = 50) {
  try {
    const { error } = await supabase
      .from('trending_hashtags')
      .insert({
        user_id: userId,
        hashtag: hashtag,
        trend_score: score,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error tracking hashtag:', error);
  }
}

/**
 * Get top trending hashtags
 * @param {string} userId - User ID
 * @param {number} limit - Number to return
 */
export async function getTopTrendingHashtags(userId, limit = 20) {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const { data, error } = await supabase
      .from('trending_hashtags')
      .select('hashtag, trend_score')
      .eq('user_id', userId)
      .gte('created_at', oneDayAgo.toISOString())
      .order('trend_score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting trending hashtags:', error);
    return [];
  }
}

/**
 * Identify emerging trends (before they peak)
 * @param {string} industry - Industry
 * @returns {Promise<array>} Emerging trends
 */
export async function identifyEmergingTrends(industry) {
  try {
    console.log(`🚀 Identifying emerging trends in ${industry}...`);
    
    const prompt = `Identify EMERGING trends in ${industry} - trends that are just starting to gain momentum:

Focus on:
1. Early signals of new trends
2. Topics with growing interest
3. New technologies or innovations
4. Shifts in consumer behavior
5. Emerging influencers or thought leaders
6. New content formats gaining traction
7. Under-the-radar opportunities

Provide 5-7 emerging trends we should get ahead of NOW before they peak.
For each, explain:
- What it is
- Why it's emerging
- How to capitalize on it early

Format as detailed list.`;

    const response = await generateContentWithGemini(prompt, 'analysis', { industry });
    
    return {
      success: true,
      trends: response,
      industry: industry,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error identifying emerging trends:', error);
    return { success: false, trends: '' };
  }
}

/**
 * Generate trend-based content ideas
 * @param {array} trends - Current trends
 * @param {object} businessProfile - Business profile
 * @returns {Promise<array>} Content ideas
 */
export async function generateTrendBasedContent(trends, businessProfile) {
  try {
    console.log('💡 Generating content ideas from trends...');
    
    const trendList = Array.isArray(trends) 
      ? trends.map(t => t.topic || t).join(', ')
      : trends;
    
    const prompt = `Generate specific content ideas based on these trending topics:

Trends: ${trendList}

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Products/Services: ${businessProfile.productsServices}

For each trend, create 2 specific content ideas that:
1. Connect the trend to our business naturally
2. Provide value to our audience
3. Position us as industry thought leaders
4. Can be created as social media posts
5. Include clear call-to-action

Provide 10 total content ideas with:
- Post topic
- Content angle
- Why it's timely/relevant
- Suggested platform

Format as numbered list.`;

    const response = await generateContentWithGemini(prompt, 'text', businessProfile);
    
    const ideas = response
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    return ideas.slice(0, 10);
    
  } catch (error) {
    console.error('Error generating trend content:', error);
    return [];
  }
}

/**
 * Analyze audience interests and pain points
 * @param {string} industry - Industry
 * @param {string} targetAudience - Target audience description
 * @returns {Promise<object>} Audience insights
 */
export async function analyzeAudienceInterests(industry, targetAudience) {
  try {
    console.log('👥 Analyzing audience interests...');
    
    const prompt = `Analyze audience interests and pain points:

Industry: ${industry}
Target Audience: ${targetAudience}

Identify:
1. Primary interests and passions
2. Common pain points and challenges
3. Questions they're asking
4. Information they're seeking
5. Content formats they prefer
6. Influencers they follow
7. Communities they're part of
8. Buying triggers and motivations

Provide detailed audience insights to inform content strategy.`;

    const response = await generateContentWithGemini(prompt, 'analysis', { industry, targetAudience });
    
    return {
      success: true,
      insights: response,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error analyzing audience:', error);
    return { success: false, insights: '' };
  }
}

/**
 * Get content inspiration from trends
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 */
export async function getContentInspiration(userId, businessProfile) {
  try {
    console.log('✨ Getting content inspiration from trends...');
    
    // Get trending topics
    const trends = await detectTrendingTopics(businessProfile.industry, businessProfile.city);
    
    // Generate content ideas
    const ideas = await generateTrendBasedContent(trends, businessProfile);
    
    // Get seasonal opportunities
    const seasonal = await getSeasonalOpportunities(businessProfile.industry, 2);
    
    return {
      success: true,
      trends: trends.slice(0, 5),
      contentIdeas: ideas,
      seasonalOpportunities: seasonal.opportunities,
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error getting inspiration:', error);
    return {
      success: false,
      trends: [],
      contentIdeas: [],
      seasonalOpportunities: ''
    };
  }
}

export default {
  detectTrendingTopics,
  getSeasonalOpportunities,
  analyzeViralPatterns,
  trackTrendingHashtag,
  getTopTrendingHashtags,
  identifyEmergingTrends,
  generateTrendBasedContent,
  analyzeAudienceInterests,
  getContentInspiration
};
