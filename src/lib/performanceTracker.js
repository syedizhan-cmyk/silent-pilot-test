// Performance Tracking & Analytics
// Track content performance and optimize strategy

import { supabase } from './supabase';

/**
 * Track post performance
 * @param {string} postId - Post ID
 * @param {object} metrics - Engagement metrics
 */
export async function trackPostPerformance(postId, metrics) {
  try {
    const { data, error } = await supabase
      .from('post_analytics')
      .upsert({
        post_id: postId,
        likes: metrics.likes || 0,
        comments: metrics.comments || 0,
        shares: metrics.shares || 0,
        clicks: metrics.clicks || 0,
        reach: metrics.reach || 0,
        impressions: metrics.impressions || 0,
        engagement_rate: calculateEngagementRate(metrics),
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error tracking performance:', error);
    throw error;
  }
}

/**
 * Calculate engagement rate
 */
function calculateEngagementRate(metrics) {
  const totalEngagement = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0);
  const reach = metrics.reach || metrics.impressions || 1;
  return (totalEngagement / reach) * 100;
}

/**
 * Get top performing posts
 * @param {string} userId - User ID
 * @param {number} limit - Number of posts to return
 * @param {number} days - Days to look back
 */
export async function getTopPerformingPosts(userId, limit = 10, days = 30) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        post_analytics (
          likes,
          comments,
          shares,
          engagement_rate
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'posted')
      .gte('posted_at', daysAgo.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Sort by engagement
    const sorted = (data || [])
      .filter(post => post.post_analytics)
      .sort((a, b) => {
        const aRate = a.post_analytics?.engagement_rate || 0;
        const bRate = b.post_analytics?.engagement_rate || 0;
        return bRate - aRate;
      })
      .slice(0, limit);
    
    return sorted;
  } catch (error) {
    console.error('Error getting top posts:', error);
    return [];
  }
}

/**
 * Analyze content performance by type
 * @param {string} userId - User ID
 */
export async function analyzeContentPerformance(userId) {
  try {
    const { data: posts } = await supabase
      .from('scheduled_posts')
      .select(`
        type,
        post_analytics (
          engagement_rate,
          likes,
          comments,
          shares
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'posted')
      .not('post_analytics', 'is', null);
    
    // Group by content type
    const typePerformance = {};
    
    (posts || []).forEach(post => {
      const type = post.type || 'other';
      if (!typePerformance[type]) {
        typePerformance[type] = {
          count: 0,
          totalEngagement: 0,
          avgEngagement: 0
        };
      }
      
      typePerformance[type].count++;
      typePerformance[type].totalEngagement += post.post_analytics?.engagement_rate || 0;
    });
    
    // Calculate averages
    Object.keys(typePerformance).forEach(type => {
      const perf = typePerformance[type];
      perf.avgEngagement = perf.totalEngagement / perf.count;
    });
    
    return typePerformance;
  } catch (error) {
    console.error('Error analyzing performance:', error);
    return {};
  }
}

/**
 * Get performance insights and recommendations
 * @param {string} userId - User ID
 */
export async function getPerformanceInsights(userId) {
  try {
    const topPosts = await getTopPerformingPosts(userId, 5);
    const contentAnalysis = await analyzeContentPerformance(userId);
    
    const insights = [];
    
    // Find best performing content type
    let bestType = null;
    let bestEngagement = 0;
    
    Object.entries(contentAnalysis).forEach(([type, data]) => {
      if (data.avgEngagement > bestEngagement) {
        bestEngagement = data.avgEngagement;
        bestType = type;
      }
    });
    
    if (bestType) {
      insights.push({
        type: 'best_content_type',
        message: `${bestType} posts perform ${Math.round(bestEngagement)}% better on average`,
        recommendation: `Create more ${bestType} content`,
        priority: 'high'
      });
    }
    
    // Analyze posting times
    if (topPosts.length > 0) {
      const bestTimes = topPosts.map(p => {
        const date = new Date(p.posted_at);
        return date.getHours();
      });
      
      const avgBestTime = Math.round(bestTimes.reduce((a, b) => a + b, 0) / bestTimes.length);
      
      insights.push({
        type: 'optimal_timing',
        message: `Your best posts are published around ${avgBestTime}:00`,
        recommendation: `Schedule more posts for ${avgBestTime}:00 - ${avgBestTime + 2}:00`,
        priority: 'medium'
      });
    }
    
    return {
      insights,
      topPosts: topPosts.slice(0, 3),
      contentPerformance: contentAnalysis
    };
    
  } catch (error) {
    console.error('Error getting insights:', error);
    return { insights: [], topPosts: [], contentPerformance: {} };
  }
}

/**
 * Score content before posting (predict performance)
 * @param {object} post - Post object
 * @param {object} historicalData - Historical performance data
 * @returns {number} Score 0-100
 */
export function scoreContent(post, historicalData = {}) {
  let score = 50; // Base score
  
  // Length score (optimal length varies by platform)
  const optimalLength = {
    twitter: 280,
    instagram: 150,
    linkedin: 200,
    facebook: 150
  };
  
  const targetLength = optimalLength[post.platform] || 150;
  const lengthDiff = Math.abs(post.caption?.length - targetLength);
  const lengthScore = Math.max(0, 20 - (lengthDiff / 10));
  score += lengthScore;
  
  // Hashtag score
  const hashtagCount = (post.hashtags || []).length;
  if (hashtagCount >= 5 && hashtagCount <= 15) {
    score += 10;
  } else if (hashtagCount > 0) {
    score += 5;
  }
  
  // Image score
  if (post.imageUrl) {
    score += 10;
  }
  
  // CTA score
  if (post.cta || (post.caption && post.caption.includes('http'))) {
    score += 5;
  }
  
  // Historical performance of content type
  if (historicalData[post.type]) {
    const typePerf = historicalData[post.type].avgEngagement || 0;
    score += Math.min(15, typePerf / 2);
  }
  
  // Cap at 100
  return Math.min(100, Math.round(score));
}

/**
 * Generate weekly performance report
 * @param {string} userId - User ID
 */
export async function generateWeeklyReport(userId) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get posts from last week
    const { data: weekPosts } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        post_analytics (*)
      `)
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString());
    
    const totalPosts = weekPosts?.length || 0;
    const postedCount = weekPosts?.filter(p => p.status === 'posted').length || 0;
    
    // Calculate total engagement
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;
    
    (weekPosts || []).forEach(post => {
      if (post.post_analytics) {
        totalLikes += post.post_analytics.likes || 0;
        totalComments += post.post_analytics.comments || 0;
        totalShares += post.post_analytics.shares || 0;
        totalReach += post.post_analytics.reach || 0;
      }
    });
    
    const avgEngagement = postedCount > 0 
      ? ((totalLikes + totalComments + totalShares) / postedCount).toFixed(1)
      : 0;
    
    return {
      period: 'Last 7 Days',
      totalPosts,
      postedCount,
      scheduledCount: totalPosts - postedCount,
      metrics: {
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        reach: totalReach,
        avgEngagement
      },
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error generating report:', error);
    return null;
  }
}

export default {
  trackPostPerformance,
  getTopPerformingPosts,
  analyzeContentPerformance,
  getPerformanceInsights,
  scoreContent,
  generateWeeklyReport
};
