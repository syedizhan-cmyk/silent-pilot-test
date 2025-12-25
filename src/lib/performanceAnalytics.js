// Content Performance Analytics Engine
// Analyzes post performance and generates insights

import { supabase } from './supabase';
import { generateContentWithGemini } from './gemini';

/**
 * Track content performance metrics
 */
export const trackContentPerformance = async (contentId, userId, metrics) => {
  try {
    const { data: content } = await supabase
      .from('scheduled_content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (!content) {
      throw new Error('Content not found');
    }

    // Analyze content characteristics
    const contentAnalysis = analyzeContentCharacteristics(content.content);

    // Insert performance data
    const { data, error } = await supabase
      .from('content_performance')
      .insert({
        scheduled_content_id: contentId,
        user_id: userId,
        platform: content.platform,
        impressions: metrics.impressions || 0,
        likes: metrics.likes || 0,
        shares: metrics.shares || 0,
        comments: metrics.comments || 0,
        clicks: metrics.clicks || 0,
        saves: metrics.saves || 0,
        content_length: contentAnalysis.length,
        hashtag_count: contentAnalysis.hashtagCount,
        emoji_count: contentAnalysis.emojiCount,
        has_image: !!content.image_url,
        has_video: contentAnalysis.hasVideo,
        has_link: contentAnalysis.hasLink,
        has_question: contentAnalysis.hasQuestion,
        posted_at: content.published_at || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Update theme performance
    await updateThemePerformance(userId, content, data.engagement_rate);

    return data;
  } catch (error) {
    console.error('Error tracking performance:', error);
    throw error;
  }
};

/**
 * Analyze content characteristics
 */
const analyzeContentCharacteristics = (content) => {
  const hashtagCount = (content.match(/#\w+/g) || []).length;
  const emojiCount = (content.match(/[\p{Emoji}]/gu) || []).length;
  const hasLink = /https?:\/\//.test(content);
  const hasQuestion = /\?/.test(content);
  const hasVideo = /video|watch|youtube|vimeo/i.test(content);

  return {
    length: content.length,
    hashtagCount,
    emojiCount,
    hasLink,
    hasQuestion,
    hasVideo
  };
};

/**
 * Update theme performance aggregates
 */
const updateThemePerformance = async (userId, content, engagementRate) => {
  try {
    // Extract theme from content (simplified - you can enhance this)
    const theme = extractThemeFromContent(content.content);
    
    if (!theme) return;

    // Call Supabase function to update theme performance
    await supabase.rpc('update_theme_performance', {
      p_user_id: userId,
      p_theme_name: theme,
      p_platform: content.platform,
      p_engagement_rate: engagementRate
    });
  } catch (error) {
    console.error('Error updating theme performance:', error);
  }
};

/**
 * Extract theme from content
 */
const extractThemeFromContent = (content) => {
  // Extract first hashtag as theme (simplified)
  const hashtagMatch = content.match(/#(\w+)/);
  if (hashtagMatch) {
    return hashtagMatch[1];
  }

  // Or extract from first sentence
  const firstSentence = content.split(/[.!?]/)[0];
  if (firstSentence.length < 50) {
    return firstSentence.trim().substring(0, 30);
  }

  return 'general';
};

/**
 * Get performance overview for user
 */
export const getPerformanceOverview = async (userId) => {
  try {
    // Get overall stats
    const { data: stats, error: statsError } = await supabase
      .from('content_performance')
      .select('*')
      .eq('user_id', userId);

    if (statsError) throw statsError;

    if (!stats || stats.length === 0) {
      return {
        totalPosts: 0,
        avgEngagementRate: 0,
        totalImpressions: 0,
        totalLikes: 0,
        topPlatform: null,
        trend: 'no_data'
      };
    }

    // Calculate aggregates
    const totalPosts = stats.length;
    const avgEngagementRate = stats.reduce((sum, s) => sum + s.engagement_rate, 0) / totalPosts;
    const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);
    const totalLikes = stats.reduce((sum, s) => sum + s.likes, 0);

    // Find top platform
    const platformStats = {};
    stats.forEach(s => {
      if (!platformStats[s.platform]) {
        platformStats[s.platform] = { count: 0, engagement: 0 };
      }
      platformStats[s.platform].count++;
      platformStats[s.platform].engagement += s.engagement_rate;
    });

    const topPlatform = Object.keys(platformStats).reduce((a, b) =>
      platformStats[a].engagement > platformStats[b].engagement ? a : b
    );

    // Calculate trend (last 5 vs previous 5)
    const recent5 = stats.slice(-5);
    const previous5 = stats.slice(-10, -5);
    
    let trend = 'stable';
    if (recent5.length >= 5 && previous5.length >= 5) {
      const recentAvg = recent5.reduce((sum, s) => sum + s.engagement_rate, 0) / 5;
      const previousAvg = previous5.reduce((sum, s) => sum + s.engagement_rate, 0) / 5;
      
      if (recentAvg > previousAvg * 1.1) trend = 'improving';
      else if (recentAvg < previousAvg * 0.9) trend = 'declining';
    }

    return {
      totalPosts,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      totalImpressions,
      totalLikes,
      topPlatform,
      trend,
      recentPosts: stats.slice(-10).reverse()
    };
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Performance analytics tables not yet created. This is optional and will be available once you have post data.');
      return null;
    }
    console.error('Error getting performance overview:', error);
    throw error;
  }
};

/**
 * Get top performing content
 */
export const getTopPerformingContent = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('content_performance')
      .select(`
        *,
        scheduled_content:scheduled_content_id (
          content,
          image_url,
          platform,
          scheduled_for
        )
      `)
      .eq('user_id', userId)
      .order('engagement_rate', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Top content analytics not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting top content:', error);
    throw error;
  }
};

/**
 * Get theme performance
 */
export const getThemePerformance = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('theme_performance')
      .select('*')
      .eq('user_id', userId)
      .order('performance_score', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Theme performance analytics not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting theme performance:', error);
    throw error;
  }
};

/**
 * Generate performance insights using AI
 */
export const generatePerformanceInsights = async (userId) => {
  try {
    console.log('🧠 Generating performance insights...');

    // Get database insights
    const { data: dbInsights, error } = await supabase
      .rpc('generate_performance_insights', {
        p_user_id: userId
      });

    if (error) throw error;

    // Get performance data for AI analysis
    const overview = await getPerformanceOverview(userId);
    const topContent = await getTopPerformingContent(userId, 5);
    const themes = await getThemePerformance(userId);

    // Generate AI insights
    const aiInsights = await generateAIInsights(overview, topContent, themes);

    // Combine and save insights
    const allInsights = [...(dbInsights || []), ...aiInsights];

    // Save to database
    for (const insight of allInsights) {
      await supabase
        .from('strategy_insights')
        .upsert({
          user_id: userId,
          insight_type: insight.insight_type,
          insight_data: insight.insight_data,
          recommendation: insight.recommendation,
          confidence_score: insight.confidence_score || 0.8,
          is_active: true
        }, {
          onConflict: 'user_id,insight_type',
          ignoreDuplicates: false
        });
    }

    console.log('✅ Insights generated and saved!');
    return allInsights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};

/**
 * Generate AI-powered insights
 */
const generateAIInsights = async (overview, topContent, themes) => {
  const prompt = `Analyze this content performance data and provide 3-5 actionable insights:

OVERVIEW:
- Total Posts: ${overview?.totalPosts || 0}
- Average Engagement: ${overview?.avgEngagementRate || 0}%
- Top Platform: ${overview?.topPlatform || 'N/A'}
- Trend: ${overview?.trend || 'N/A'}

TOP PERFORMING CONTENT:
${topContent.map((c, i) => `
${i + 1}. Engagement: ${c.engagement_rate}%
   Content: ${c.scheduled_content?.content?.substring(0, 100)}...
   Platform: ${c.platform}
`).join('')}

TOP THEMES:
${themes.slice(0, 5).map((t, i) => `
${i + 1}. ${t.theme_name}: ${t.avg_engagement_rate}% engagement (${t.total_posts} posts)
`).join('')}

Provide insights in this format:
1. Pattern identified
2. Specific recommendation
3. Expected impact

Focus on actionable advice that will improve engagement.`;

  try {
    const response = await generateContentWithGemini(prompt, 'analysis', '');
    
    // Parse AI response into structured insights
    const insights = parseAIInsights(response);
    
    return insights;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return [];
  }
};

/**
 * Parse AI insights into structured format
 */
const parseAIInsights = (aiResponse) => {
  const insights = [];
  
  // Split by numbered items
  const sections = aiResponse.split(/\d+\.\s+/).filter(s => s.trim());
  
  sections.forEach((section, index) => {
    const lines = section.split('\n').filter(l => l.trim());
    
    if (lines.length >= 2) {
      insights.push({
        insight_type: 'ai_recommendation',
        insight_data: {
          pattern: lines[0],
          recommendation: lines[1],
          impact: lines[2] || 'Improved engagement expected',
          priority: index + 1
        },
        recommendation: lines[1],
        confidence_score: 0.75
      });
    }
  });
  
  return insights;
};

/**
 * Get active insights for user
 */
export const getActiveInsights = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('strategy_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Insights analytics not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting insights:', error);
    throw error;
  }
};

/**
 * Apply insight to content strategy
 */
export const applyInsight = async (insightId, userId) => {
  try {
    const { error } = await supabase
      .from('strategy_insights')
      .update({
        applied_at: new Date().toISOString()
      })
      .eq('id', insightId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error applying insight:', error);
    throw error;
  }
};

/**
 * Get performance by platform
 */
export const getPerformanceByPlatform = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('content_performance')
      .select('platform, engagement_rate, impressions, likes, shares, comments')
      .eq('user_id', userId);

    if (error) throw error;

    // Aggregate by platform
    const platformStats = {};
    
    data.forEach(item => {
      if (!platformStats[item.platform]) {
        platformStats[item.platform] = {
          count: 0,
          totalEngagement: 0,
          totalImpressions: 0,
          totalLikes: 0,
          totalShares: 0,
          totalComments: 0
        };
      }
      
      const stats = platformStats[item.platform];
      stats.count++;
      stats.totalEngagement += item.engagement_rate;
      stats.totalImpressions += item.impressions;
      stats.totalLikes += item.likes;
      stats.totalShares += item.shares;
      stats.totalComments += item.comments;
    });

    // Calculate averages
    Object.keys(platformStats).forEach(platform => {
      const stats = platformStats[platform];
      stats.avgEngagement = stats.totalEngagement / stats.count;
    });

    return platformStats;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Platform performance analytics not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting platform performance:', error);
    throw error;
  }
};

/**
 * Get engagement over time (for charts)
 */
export const getEngagementOverTime = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('content_performance')
      .select('posted_at, engagement_rate, platform')
      .eq('user_id', userId)
      .gte('posted_at', startDate.toISOString())
      .order('posted_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Engagement timeline not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting engagement over time:', error);
    throw error;
  }
};

/**
 * Predict best time to post based on historical data
 */
export const predictBestPostingTime = async (userId, platform) => {
  try {
    const { data, error } = await supabase
      .from('content_performance')
      .select('posted_at, engagement_rate')
      .eq('user_id', userId)
      .eq('platform', platform)
      .not('posted_at', 'is', null);

    if (error) throw error;

    if (!data || data.length < 5) {
      return { hour: 10, confidence: 'low', message: 'Not enough data yet' };
    }

    // Aggregate by hour
    const hourStats = {};
    
    data.forEach(item => {
      const hour = new Date(item.posted_at).getHours();
      if (!hourStats[hour]) {
        hourStats[hour] = { total: 0, count: 0 };
      }
      hourStats[hour].total += item.engagement_rate;
      hourStats[hour].count++;
    });

    // Find best hour
    let bestHour = 10;
    let bestEngagement = 0;

    Object.keys(hourStats).forEach(hour => {
      const avg = hourStats[hour].total / hourStats[hour].count;
      if (avg > bestEngagement) {
        bestEngagement = avg;
        bestHour = parseInt(hour);
      }
    });

    return {
      hour: bestHour,
      confidence: data.length > 20 ? 'high' : 'medium',
      avgEngagement: Math.round(bestEngagement * 100) / 100,
      message: `Posts at ${bestHour}:00 get ${Math.round(bestEngagement)}% engagement`
    };
  } catch (error) {
    console.error('Error predicting best time:', error);
    return { hour: 10, confidence: 'low', message: 'Error analyzing data' };
  }
};

/**
 * Get content recommendations based on performance
 */
export const getContentRecommendations = async (userId) => {
  try {
    const overview = await getPerformanceOverview(userId);
    const themes = await getThemePerformance(userId);
    const insights = await getActiveInsights(userId);

    const recommendations = [];

    // Recommend top themes
    if (themes.length > 0) {
      const topTheme = themes[0];
      recommendations.push({
        type: 'theme',
        priority: 'high',
        message: `Create more content about "${topTheme.theme_name}" - it gets ${Math.round(topTheme.avg_engagement_rate)}% engagement`,
        action: 'Generate content on this theme'
      });
    }

    // Recommend based on trend
    if (overview && overview.trend === 'declining') {
      recommendations.push({
        type: 'strategy',
        priority: 'high',
        message: 'Engagement is declining. Try new content formats or themes.',
        action: 'Experiment with different content types'
      });
    }

    // Add insights as recommendations
    insights.slice(0, 3).forEach(insight => {
      recommendations.push({
        type: 'insight',
        priority: 'medium',
        message: insight.recommendation,
        action: 'Apply this insight',
        insightId: insight.id
      });
    });

    return recommendations;
  } catch (error) {
    // Suppress error if table doesn't exist (optional analytics feature)
    if (error?.code === 'PGRST205') {
      console.warn('Content recommendations not yet available. This feature activates after you publish posts.');
      return [];
    }
    console.error('Error getting recommendations:', error);
    return [];
  }
};
