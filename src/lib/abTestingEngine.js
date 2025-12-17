// Self-Learning A/B Testing Engine
// Automatically tests, learns, and optimizes content performance
import { supabase } from './supabase';
import { generateContentWithGemini } from './gemini';

/**
 * Self-Learning A/B Testing Engine
 * Learns from every post and optimizes future content automatically
 */

/**
 * Create A/B test for social media post
 */
export const createABTest = async (originalPost, userId, platform) => {
  try {
    console.log('🧪 Creating A/B test variants...');

    // Generate 2-3 variants with different approaches
    const variants = await generatePostVariants(originalPost, platform);

    // Save test to database
    const { data: test, error } = await supabase
      .from('ab_tests')
      .insert({
        user_id: userId,
        platform: platform,
        original_content: originalPost,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Save variants
    const variantInserts = variants.map((v, index) => ({
      test_id: test.id,
      variant_name: v.name,
      content: v.content,
      hypothesis: v.hypothesis,
      traffic_allocation: 100 / (variants.length + 1), // Equal distribution initially
      variant_index: index
    }));

    await supabase.from('ab_test_variants').insert(variantInserts);

    console.log(`✅ Created A/B test with ${variants.length} variants`);

    return {
      testId: test.id,
      variants: variants,
      control: originalPost
    };

  } catch (error) {
    console.error('Error creating A/B test:', error);
    throw error;
  }
};

/**
 * Generate content variants using AI
 */
async function generatePostVariants(originalContent, platform) {
  const prompt = `Create 3 different variants of this social media post for A/B testing on ${platform}.

Original Post:
${originalContent}

Create variants that test:
1. Variant A - Emotional Appeal: Focus on emotions and storytelling
2. Variant B - Data-Driven: Use statistics and facts
3. Variant C - Question/Curiosity: Lead with a question or curiosity gap

For each variant:
- Keep core message the same
- Test different angles/hooks
- Maintain similar length
- Include hashtags

Return as JSON:
[
  {
    "name": "Variant A - Emotional",
    "content": "...",
    "hypothesis": "Emotional connection drives more engagement"
  },
  ...
]`;

  try {
    const response = await generateContentWithGemini(prompt, platform);
    return JSON.parse(response);
  } catch (error) {
    // Fallback variants
    return [
      {
        name: "Variant A - Emotional",
        content: originalContent + " ❤️",
        hypothesis: "Adding emotion increases engagement"
      },
      {
        name: "Variant B - Question",
        content: "What if " + originalContent,
        hypothesis: "Questions drive curiosity"
      }
    ];
  }
}

/**
 * Record performance data for learning
 */
export const recordPerformance = async (postId, performanceData) => {
  try {
    const { error } = await supabase
      .from('post_performance')
      .upsert({
        post_id: postId,
        ...performanceData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'post_id' });

    if (error) throw error;

    // Trigger learning algorithm
    await learnFromPerformance(postId);

  } catch (error) {
    console.error('Error recording performance:', error);
  }
};

/**
 * AI Learning Engine - analyzes performance and adapts
 */
async function learnFromPerformance(postId) {
  try {
    console.log('🧠 AI learning from performance data...');

    // Get post with performance
    const { data: post } = await supabase
      .from('scheduled_content')
      .select(`
        *,
        post_performance(*)
      `)
      .eq('id', postId)
      .single();

    if (!post || !post.post_performance) return;

    // Extract learnings
    const learnings = {
      platform: post.platform,
      contentType: post.type,
      timeOfDay: new Date(post.scheduled_for).getHours(),
      dayOfWeek: new Date(post.scheduled_for).getDay(),
      engagement: post.post_performance.engagement_rate,
      reach: post.post_performance.reach,
      clicks: post.post_performance.clicks,
      hasHashtags: (post.content.match(/#/g) || []).length,
      hasEmoji: /[\u{1F300}-\u{1F9FF}]/u.test(post.content),
      contentLength: post.content.length
    };

    // Store learning
    await supabase
      .from('ai_learning_data')
      .insert({
        user_id: post.user_id,
        data_type: 'post_performance',
        platform: post.platform,
        metrics: learnings,
        performance_score: calculatePerformanceScore(learnings),
        created_at: new Date().toISOString()
      });

    console.log('✅ Learning recorded');

  } catch (error) {
    console.error('Error in learning:', error);
  }
}

/**
 * Get AI recommendations based on learned data
 */
export const getAIRecommendations = async (userId, platform) => {
  try {
    console.log('🤖 Generating AI recommendations based on learning...');

    // Get all learning data for this user and platform
    const { data: learnings } = await supabase
      .from('ai_learning_data')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', platform)
      .eq('data_type', 'post_performance')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!learnings || learnings.length === 0) {
      return getDefaultRecommendations(platform);
    }

    // Analyze patterns
    const recommendations = analyzePatterns(learnings);

    return recommendations;

  } catch (error) {
    console.error('Error getting recommendations:', error);
    return getDefaultRecommendations(platform);
  }
};

/**
 * Auto-optimize content before posting
 */
export const autoOptimizeContent = async (content, userId, platform) => {
  try {
    console.log('⚡ Auto-optimizing content based on learnings...');

    // Get AI recommendations
    const recommendations = await getAIRecommendations(userId, platform);

    // Apply optimizations
    let optimizedContent = content;

    // Add emojis if they improve performance
    if (recommendations.useEmoji && !/[\u{1F300}-\u{1F9FF}]/u.test(content)) {
      const prompt = `Add 2-3 relevant emojis to this post naturally: ${content}`;
      optimizedContent = await generateContentWithGemini(prompt, platform);
    }

    // Optimize hashtags
    if (recommendations.optimalHashtagCount) {
      const currentHashtags = (content.match(/#\w+/g) || []).length;
      if (currentHashtags < recommendations.optimalHashtagCount) {
        const prompt = `Add ${recommendations.optimalHashtagCount - currentHashtags} more relevant hashtags to: ${content}`;
        optimizedContent = await generateContentWithGemini(prompt, platform);
      }
    }

    // Adjust length if needed
    if (recommendations.optimalLength && content.length < recommendations.optimalLength.min) {
      const prompt = `Expand this post to ${recommendations.optimalLength.target} characters while keeping the core message: ${content}`;
      optimizedContent = await generateContentWithGemini(prompt, platform);
    }

    return {
      original: content,
      optimized: optimizedContent,
      changes: recommendations.appliedOptimizations,
      expectedImprovement: recommendations.expectedImprovement
    };

  } catch (error) {
    console.error('Error auto-optimizing:', error);
    return { original: content, optimized: content };
  }
};

/**
 * Continuous Learning Loop - runs periodically
 */
export const runLearningCycle = async (userId) => {
  try {
    console.log('🔄 Running AI learning cycle...');

    // 1. Analyze all recent posts
    const { data: recentPosts } = await supabase
      .from('scheduled_content')
      .select(`
        *,
        post_performance(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'published')
      .gte('published_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .not('post_performance', 'is', null);

    if (!recentPosts || recentPosts.length === 0) {
      return { learned: false, reason: 'No recent data' };
    }

    // 2. Find winning patterns
    const patterns = identifyWinningPatterns(recentPosts);

    // 3. Update AI model preferences
    await updateUserPreferences(userId, patterns);

    // 4. Generate new optimization rules
    const rules = generateOptimizationRules(patterns);

    // 5. Save for future use
    await supabase
      .from('ai_optimization_rules')
      .upsert({
        user_id: userId,
        rules: rules,
        patterns: patterns,
        updated_at: new Date().toISOString(),
        sample_size: recentPosts.length
      }, { onConflict: 'user_id' });

    console.log(`✅ Learning cycle complete. Analyzed ${recentPosts.length} posts.`);

    return {
      learned: true,
      postsAnalyzed: recentPosts.length,
      patternsFound: Object.keys(patterns).length,
      rulesGenerated: rules.length
    };

  } catch (error) {
    console.error('Error in learning cycle:', error);
    return { learned: false, error: error.message };
  }
};

// Helper Functions

function calculatePerformanceScore(learnings) {
  // Weighted score based on multiple factors
  const engagementScore = (learnings.engagement || 0) * 0.4;
  const reachScore = Math.min((learnings.reach || 0) / 1000, 10) * 0.3;
  const clickScore = (learnings.clicks || 0) * 0.3;
  
  return engagementScore + reachScore + clickScore;
}

function analyzePatterns(learnings) {
  // Group by different factors
  const byEmoji = { with: [], without: [] };
  const byLength = { short: [], medium: [], long: [] };
  const byTime = {};

  learnings.forEach(l => {
    const metrics = l.metrics;
    
    // Emoji analysis
    if (metrics.hasEmoji) {
      byEmoji.with.push(l.performance_score);
    } else {
      byEmoji.without.push(l.performance_score);
    }

    // Length analysis
    if (metrics.contentLength < 100) {
      byLength.short.push(l.performance_score);
    } else if (metrics.contentLength <= 200) {
      byLength.medium.push(l.performance_score);
    } else {
      byLength.long.push(l.performance_score);
    }

    // Time analysis
    const timeKey = `${metrics.dayOfWeek}-${metrics.timeOfDay}`;
    if (!byTime[timeKey]) byTime[timeKey] = [];
    byTime[timeKey].push(l.performance_score);
  });

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  return {
    useEmoji: avg(byEmoji.with) > avg(byEmoji.without),
    emojiImpact: ((avg(byEmoji.with) - avg(byEmoji.without)) / avg(byEmoji.without) * 100).toFixed(1),
    optimalLength: avg(byLength.medium) > avg(byLength.short) ? 'medium' : 'short',
    optimalHashtagCount: Math.round(avg(learnings.map(l => l.metrics.hasHashtags))),
    bestTimes: findBestTimes(byTime),
    expectedImprovement: '15-25%'
  };
}

function findBestTimes(timeData) {
  const sorted = Object.entries(timeData)
    .map(([key, scores]) => ({
      key,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  return sorted.slice(0, 3).map(t => t.key);
}

function getDefaultRecommendations(platform) {
  const defaults = {
    linkedin: {
      optimalLength: { min: 150, target: 200, max: 300 },
      useEmoji: true,
      optimalHashtagCount: 3,
      bestTimes: ['Tuesday-10', 'Wednesday-14', 'Thursday-9'],
      expectedImprovement: '10-15%'
    },
    twitter: {
      optimalLength: { min: 100, target: 150, max: 280 },
      useEmoji: true,
      optimalHashtagCount: 2,
      bestTimes: ['Wednesday-12', 'Thursday-15', 'Friday-10'],
      expectedImprovement: '10-15%'
    },
    instagram: {
      optimalLength: { min: 100, target: 200, max: 500 },
      useEmoji: true,
      optimalHashtagCount: 8,
      bestTimes: ['Monday-11', 'Wednesday-19', 'Friday-17'],
      expectedImprovement: '10-15%'
    },
    facebook: {
      optimalLength: { min: 100, target: 150, max: 300 },
      useEmoji: true,
      optimalHashtagCount: 3,
      bestTimes: ['Tuesday-13', 'Wednesday-15', 'Saturday-9'],
      expectedImprovement: '10-15%'
    }
  };

  return defaults[platform] || defaults.linkedin;
}

function identifyWinningPatterns(posts) {
  // Identify patterns in high-performing posts
  const highPerformers = posts.filter(p => 
    (p.post_performance?.engagement_rate || 0) > getAverageEngagement(posts)
  );

  return {
    commonHashtags: extractCommonHashtags(highPerformers),
    commonEmojis: extractCommonEmojis(highPerformers),
    contentStructure: analyzeContentStructure(highPerformers),
    optimalPostingTimes: extractOptimalTimes(highPerformers),
    effectiveCTAs: extractCTAs(highPerformers)
  };
}

function getAverageEngagement(posts) {
  if (posts.length === 0) return 0;
  return posts.reduce((sum, p) => sum + (p.post_performance?.engagement_rate || 0), 0) / posts.length;
}

function extractCommonHashtags(posts) {
  const hashtagMap = {};
  
  posts.forEach(post => {
    const hashtags = post.content.match(/#\w+/g) || [];
    hashtags.forEach(tag => {
      hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
    });
  });

  return Object.entries(hashtagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, frequency: count }));
}

function extractCommonEmojis(posts) {
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
  const emojiMap = {};

  posts.forEach(post => {
    const emojis = post.content.match(emojiRegex) || [];
    emojis.forEach(emoji => {
      emojiMap[emoji] = (emojiMap[emoji] || 0) + 1;
    });
  });

  return Object.entries(emojiMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}

function analyzeContentStructure(posts) {
  return {
    avgLength: Math.round(posts.reduce((sum, p) => sum + p.content.length, 0) / posts.length),
    avgHashtags: Math.round(posts.reduce((sum, p) => sum + (p.content.match(/#/g) || []).length, 0) / posts.length),
    avgEmojis: Math.round(posts.reduce((sum, p) => sum + (p.content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length, 0) / posts.length)
  };
}

function extractOptimalTimes(posts) {
  const timeMap = {};

  posts.forEach(post => {
    const date = new Date(post.published_at || post.scheduled_for);
    const day = date.getDay();
    const hour = date.getHours();
    const key = `${day}-${hour}`;

    if (!timeMap[key]) {
      timeMap[key] = { count: 0, totalEngagement: 0 };
    }

    timeMap[key].count++;
    timeMap[key].totalEngagement += post.post_performance?.engagement_rate || 0;
  });

  return Object.entries(timeMap)
    .map(([key, data]) => ({
      key,
      avgEngagement: data.totalEngagement / data.count
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 5);
}

function extractCTAs(posts) {
  // Simple CTA extraction
  const ctaPatterns = [
    /learn more/i, /click here/i, /sign up/i, /get started/i,
    /download/i, /register/i, /join us/i, /contact us/i
  ];

  const ctaMap = {};

  posts.forEach(post => {
    ctaPatterns.forEach((pattern, index) => {
      if (pattern.test(post.content)) {
        const ctaName = pattern.source.replace(/[\\\/]/g, '');
        if (!ctaMap[ctaName]) {
          ctaMap[ctaName] = { count: 0, totalEngagement: 0 };
        }
        ctaMap[ctaName].count++;
        ctaMap[ctaName].totalEngagement += post.post_performance?.engagement_rate || 0;
      }
    });
  });

  return Object.entries(ctaMap)
    .map(([cta, data]) => ({
      cta,
      avgEngagement: data.totalEngagement / data.count
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3);
}

async function updateUserPreferences(userId, patterns) {
  await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      content_preferences: patterns,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
}

function generateOptimizationRules(patterns) {
  const rules = [];

  if (patterns.commonHashtags.length > 0) {
    rules.push({
      type: 'hashtags',
      action: 'include',
      data: patterns.commonHashtags.slice(0, 5).map(h => h.tag),
      reason: 'These hashtags consistently drive engagement'
    });
  }

  if (patterns.optimalPostingTimes.length > 0) {
    rules.push({
      type: 'timing',
      action: 'schedule_at',
      data: patterns.optimalPostingTimes,
      reason: 'These times show highest engagement'
    });
  }

  if (patterns.effectiveCTAs.length > 0) {
    rules.push({
      type: 'cta',
      action: 'use',
      data: patterns.effectiveCTAs.map(c => c.cta),
      reason: 'These CTAs drive more clicks'
    });
  }

  rules.push({
    type: 'structure',
    action: 'format',
    data: patterns.contentStructure,
    reason: 'Winning content follows this structure'
  });

  return rules;
}

function getDefaultOptimalTime() {
  // Default to next Tuesday at 10 AM (generally good engagement time)
  const scheduledDate = new Date();
  const daysUntilTuesday = (2 + 7 - scheduledDate.getDay()) % 7 || 7;
  scheduledDate.setDate(scheduledDate.getDate() + daysUntilTuesday);
  scheduledDate.setHours(10, 0, 0, 0);
  
  return scheduledDate.toISOString();
}

/**
 * Smart Scheduler - learns best times for each user
 */
export const smartSchedulePost = async (post, userId) => {
  try {
    // Get user's optimal times based on learning
    const { data: rules } = await supabase
      .from('ai_optimization_rules')
      .select('rules, patterns')
      .eq('user_id', userId)
      .single();

    if (!rules || !rules.patterns) {
      // Use default optimal time
      return getDefaultOptimalTime();
    }

    // Find best time for this platform
    const timingRule = rules.rules.find(r => r.type === 'timing');
    if (timingRule && timingRule.data.length > 0) {
      const bestTime = timingRule.data[0];
      const [day, hour] = bestTime.key.split('-').map(Number);
      
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + ((day + 7 - scheduledDate.getDay()) % 7));
      scheduledDate.setHours(hour, 0, 0, 0);
      
      if (scheduledDate < new Date()) {
        scheduledDate.setDate(scheduledDate.getDate() + 7);
      }
      
      return scheduledDate.toISOString();
    }

    return getDefaultOptimalTime();

  } catch (error) {
    console.error('Error in smart scheduling:', error);
    return getDefaultOptimalTime();
  }
};
