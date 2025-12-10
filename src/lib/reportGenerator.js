// Report Generator
// Generate comprehensive marketing reports and dashboards

import { generateContentWithGemini } from './gemini';
import { supabase } from './supabase';
import { getTopPerformingPosts, analyzeContentPerformance, generateWeeklyReport } from './performanceTracker';
import { getCompetitorInsights } from './competitorMonitor';
import { detectTrendingTopics } from './trendDetector';
import { getEngagementSummary } from './engagementBot';

/**
 * Generate comprehensive weekly report
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @returns {Promise<object>} Weekly report
 */
export async function generateComprehensiveWeeklyReport(userId, businessProfile) {
  try {
    console.log('📊 Generating comprehensive weekly report...');
    
    // Gather all data
    const [
      weeklyPerformance,
      topPosts,
      contentAnalysis,
      engagementSummary,
      competitorInsights,
      trends
    ] = await Promise.all([
      generateWeeklyReport(userId),
      getTopPerformingPosts(userId, 5, 7),
      analyzeContentPerformance(userId),
      getEngagementSummary(userId, 7),
      getCompetitorInsights(userId, 7),
      detectTrendingTopics(businessProfile.industry, businessProfile.city).catch(() => [])
    ]);
    
    // Generate AI insights
    const aiInsights = await generateAIInsights({
      performance: weeklyPerformance,
      topPosts,
      contentAnalysis,
      engagement: engagementSummary
    }, businessProfile);
    
    const report = {
      reportType: 'weekly',
      period: weeklyPerformance?.period || 'Last 7 Days',
      generatedAt: new Date().toISOString(),
      
      // Performance Summary
      performance: {
        totalPosts: weeklyPerformance?.totalPosts || 0,
        postedCount: weeklyPerformance?.postedCount || 0,
        scheduledCount: weeklyPerformance?.scheduledCount || 0,
        metrics: weeklyPerformance?.metrics || {
          likes: 0,
          comments: 0,
          shares: 0,
          reach: 0,
          avgEngagement: 0
        }
      },
      
      // Top Content
      topContent: topPosts.map(post => ({
        caption: post.caption?.substring(0, 100) + '...',
        platform: post.platform,
        type: post.type,
        engagement: post.post_analytics?.engagement_rate || 0,
        postedAt: post.posted_at
      })),
      
      // Content Type Performance
      contentTypePerformance: contentAnalysis,
      
      // Engagement Activities
      engagement: {
        likes: engagementSummary.likes || 0,
        comments: engagementSummary.comments || 0,
        follows: engagementSummary.follows || 0,
        responses: engagementSummary.responses || 0,
        total: engagementSummary.total || 0
      },
      
      // Competitor Insights
      competitors: {
        insights: competitorInsights.insights || [],
        totalActivity: competitorInsights.totalActivity || 0
      },
      
      // Trending Topics
      trends: trends.slice(0, 5).map(t => ({
        topic: t.topic,
        details: t.details?.substring(0, 150)
      })),
      
      // AI-Generated Insights
      aiInsights: aiInsights,
      
      // Recommendations
      recommendations: generateRecommendations({
        performance: weeklyPerformance,
        contentAnalysis,
        engagement: engagementSummary
      })
    };
    
    // Save report to database
    await saveReport(userId, report);
    
    return report;
    
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    throw error;
  }
}

/**
 * Generate monthly performance report
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @returns {Promise<object>} Monthly report
 */
export async function generateMonthlyReport(userId, businessProfile) {
  try {
    console.log('📊 Generating monthly report...');
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Get monthly data
    const { data: monthlyPosts } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        post_analytics (*)
      `)
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    const totalPosts = monthlyPosts?.length || 0;
    const postedCount = monthlyPosts?.filter(p => p.status === 'posted').length || 0;
    
    // Calculate totals
    let totalEngagement = 0;
    let totalReach = 0;
    let topPost = null;
    let maxEngagement = 0;
    
    (monthlyPosts || []).forEach(post => {
      if (post.post_analytics) {
        const engagement = (post.post_analytics.likes || 0) + 
                          (post.post_analytics.comments || 0) + 
                          (post.post_analytics.shares || 0);
        totalEngagement += engagement;
        totalReach += post.post_analytics.reach || 0;
        
        if (engagement > maxEngagement) {
          maxEngagement = engagement;
          topPost = post;
        }
      }
    });
    
    const avgEngagement = postedCount > 0 ? Math.round(totalEngagement / postedCount) : 0;
    
    // Growth metrics (compare to previous month)
    const previousMonthData = await getPreviousMonthData(userId);
    const growth = calculateGrowth(
      { posts: postedCount, engagement: totalEngagement, reach: totalReach },
      previousMonthData
    );
    
    const report = {
      reportType: 'monthly',
      period: 'Last 30 Days',
      generatedAt: new Date().toISOString(),
      
      summary: {
        totalPosts,
        postedCount,
        avgEngagement,
        totalReach,
        topPost: topPost ? {
          caption: topPost.caption?.substring(0, 100),
          engagement: maxEngagement,
          platform: topPost.platform
        } : null
      },
      
      growth: growth,
      
      goals: {
        postsGoal: 60, // 2 per day
        postsActual: postedCount,
        engagementGoal: 50,
        engagementActual: avgEngagement,
        achievementRate: Math.round((postedCount / 60) * 100)
      }
    };
    
    await saveReport(userId, report);
    
    return report;
    
  } catch (error) {
    console.error('Error generating monthly report:', error);
    throw error;
  }
}

/**
 * Generate AI insights from data
 */
async function generateAIInsights(data, businessProfile) {
  try {
    const prompt = `Analyze this marketing performance data and provide strategic insights:

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}

Performance Data:
- Total Posts: ${data.performance?.totalPosts || 0}
- Posted: ${data.performance?.postedCount || 0}
- Avg Engagement: ${data.performance?.metrics?.avgEngagement || 0}
- Likes: ${data.performance?.metrics?.likes || 0}
- Comments: ${data.performance?.metrics?.comments || 0}

Top Performing Content Type: ${Object.keys(data.contentAnalysis || {})[0] || 'N/A'}

Engagement Activities:
- Auto-likes: ${data.engagement?.likes || 0}
- Comments: ${data.engagement?.comments || 0}
- Follows: ${data.engagement?.follows || 0}

Provide:
1. Key wins this week (what worked well)
2. Areas for improvement
3. Strategic recommendations
4. Action items for next week

Keep it concise and actionable (5-7 bullet points).`;

    const insights = await generateContentWithGemini(prompt, 'analysis', businessProfile);
    return insights;
    
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return 'Unable to generate AI insights at this time.';
  }
}

/**
 * Generate recommendations based on data
 */
function generateRecommendations(data) {
  const recommendations = [];
  
  // Posting frequency
  if ((data.performance?.postedCount || 0) < 10) {
    recommendations.push({
      type: 'posting_frequency',
      priority: 'high',
      message: 'Increase posting frequency',
      action: 'Aim for at least 14 posts per week (2 per day)'
    });
  }
  
  // Engagement
  if ((data.performance?.metrics?.avgEngagement || 0) < 20) {
    recommendations.push({
      type: 'engagement',
      priority: 'medium',
      message: 'Boost engagement with more interactive content',
      action: 'Create more questions, polls, and engagement posts'
    });
  }
  
  // Content variety
  const typeCount = Object.keys(data.contentAnalysis || {}).length;
  if (typeCount < 3) {
    recommendations.push({
      type: 'content_variety',
      priority: 'medium',
      message: 'Diversify content types',
      action: 'Mix educational, promotional, and engagement posts'
    });
  }
  
  // Engagement bot
  if ((data.engagement?.total || 0) < 50) {
    recommendations.push({
      type: 'audience_engagement',
      priority: 'medium',
      message: 'Increase audience engagement activities',
      action: 'Engage more with relevant posts in your industry'
    });
  }
  
  return recommendations;
}

/**
 * Get previous month data for comparison
 */
async function getPreviousMonthData(userId) {
  try {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        post_analytics (*)
      `)
      .eq('user_id', userId)
      .gte('created_at', sixtyDaysAgo.toISOString())
      .lt('created_at', thirtyDaysAgo.toISOString());
    
    const posts = data?.filter(p => p.status === 'posted').length || 0;
    let engagement = 0;
    let reach = 0;
    
    (data || []).forEach(post => {
      if (post.post_analytics) {
        engagement += (post.post_analytics.likes || 0) + 
                      (post.post_analytics.comments || 0) + 
                      (post.post_analytics.shares || 0);
        reach += post.post_analytics.reach || 0;
      }
    });
    
    return { posts, engagement, reach };
    
  } catch (error) {
    return { posts: 0, engagement: 0, reach: 0 };
  }
}

/**
 * Calculate growth percentages
 */
function calculateGrowth(current, previous) {
  const calculatePercent = (curr, prev) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };
  
  return {
    posts: calculatePercent(current.posts, previous.posts),
    engagement: calculatePercent(current.engagement, previous.engagement),
    reach: calculatePercent(current.reach, previous.reach)
  };
}

/**
 * Save report to database
 */
async function saveReport(userId, report) {
  try {
    const { error } = await supabase
      .from('marketing_reports')
      .insert({
        user_id: userId,
        report_type: report.reportType,
        report_data: report,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving report:', error);
  }
}

/**
 * Get saved reports
 * @param {string} userId - User ID
 * @param {string} type - Report type (weekly, monthly, custom)
 * @param {number} limit - Number of reports to return
 */
export async function getSavedReports(userId, type = 'all', limit = 10) {
  try {
    let query = supabase
      .from('marketing_reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (type !== 'all') {
      query = query.eq('report_type', type);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error('Error getting saved reports:', error);
    return [];
  }
}

/**
 * Generate custom report with specific date range and metrics
 * @param {string} userId - User ID
 * @param {object} options - Report options
 */
export async function generateCustomReport(userId, options) {
  try {
    const { startDate, endDate, metrics, businessProfile } = options;
    
    console.log(`📊 Generating custom report from ${startDate} to ${endDate}...`);
    
    const { data } = await supabase
      .from('scheduled_posts')
      .select(`
        *,
        post_analytics (*)
      `)
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);
    
    // Calculate requested metrics
    const report = {
      reportType: 'custom',
      period: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      generatedAt: new Date().toISOString(),
      metrics: {}
    };
    
    if (metrics.includes('posts')) {
      report.metrics.totalPosts = data?.length || 0;
      report.metrics.postedCount = data?.filter(p => p.status === 'posted').length || 0;
    }
    
    if (metrics.includes('engagement')) {
      let totalEngagement = 0;
      (data || []).forEach(post => {
        if (post.post_analytics) {
          totalEngagement += (post.post_analytics.likes || 0) + 
                            (post.post_analytics.comments || 0) + 
                            (post.post_analytics.shares || 0);
        }
      });
      report.metrics.totalEngagement = totalEngagement;
      report.metrics.avgEngagement = data?.length > 0 
        ? Math.round(totalEngagement / data.length) 
        : 0;
    }
    
    await saveReport(userId, report);
    
    return report;
    
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
}

/**
 * Export report as formatted text or JSON
 * @param {object} report - Report object
 * @param {string} format - 'text' or 'json'
 */
export function exportReport(report, format = 'text') {
  if (format === 'json') {
    return JSON.stringify(report, null, 2);
  }
  
  // Format as readable text
  let text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${report.reportType.toUpperCase()} MARKETING REPORT
  ${report.period}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PERFORMANCE SUMMARY
─────────────────────────────────────────
Total Posts: ${report.performance?.totalPosts || 0}
Posted: ${report.performance?.postedCount || 0}
Scheduled: ${report.performance?.scheduledCount || 0}
Avg Engagement: ${report.performance?.metrics?.avgEngagement || 0}
Total Reach: ${report.performance?.metrics?.reach || 0}

👍 ENGAGEMENT
─────────────────────────────────────────
Likes: ${report.performance?.metrics?.likes || 0}
Comments: ${report.performance?.metrics?.comments || 0}
Shares: ${report.performance?.metrics?.shares || 0}

🤖 AUTOMATION ACTIVITIES
─────────────────────────────────────────
Auto-Likes: ${report.engagement?.likes || 0}
Comments Posted: ${report.engagement?.comments || 0}
Follows: ${report.engagement?.follows || 0}
Auto-Responses: ${report.engagement?.responses || 0}

🎯 TOP CONTENT
─────────────────────────────────────────
${(report.topContent || []).map((post, i) => 
  `${i + 1}. ${post.caption} (${post.platform})`
).join('\n')}

💡 AI INSIGHTS
─────────────────────────────────────────
${report.aiInsights || 'No insights available'}

📈 RECOMMENDATIONS
─────────────────────────────────────────
${(report.recommendations || []).map((rec, i) => 
  `${i + 1}. ${rec.message}\n   Action: ${rec.action}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: ${new Date(report.generatedAt).toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `;
  
  return text;
}

export default {
  generateComprehensiveWeeklyReport,
  generateMonthlyReport,
  generateCustomReport,
  getSavedReports,
  exportReport
};
