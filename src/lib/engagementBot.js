// Audience Engagement Bot
// Automatically engage with audience to grow following

import { generateContentWithGemini } from './gemini';
import { supabase } from './supabase';

// Safety limits to prevent spam
const RATE_LIMITS = {
  likes_per_hour: 30,
  comments_per_hour: 10,
  follows_per_hour: 20,
  daily_interactions: 200
};

/**
 * Generate AI comment for a post
 * @param {string} postContent - The post to comment on
 * @param {object} businessProfile - User's business profile
 * @returns {Promise<string>} Generated comment
 */
export async function generateEngagementComment(postContent, businessProfile) {
  try {
    const prompt = `Generate a genuine, helpful comment for this social media post.

Post: ${postContent.substring(0, 200)}

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}

Requirements:
- 1-2 sentences only
- Natural and conversational
- Helpful or supportive
- NOT promotional or spammy
- No emojis
- Professional yet friendly
- Relevant to the post content

Write only the comment, no explanations:`;

    const comment = await generateContentWithGemini(prompt, 'text', businessProfile);
    return comment.trim().replace(/^["']|["']$/g, '');
    
  } catch (error) {
    console.error('Error generating comment:', error);
    // Fallback generic comments
    const fallbacks = [
      'Great insight! Thanks for sharing.',
      'This is really helpful information.',
      'Interesting perspective!',
      'Thanks for posting this.',
      'Great content!'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

/**
 * Auto-like relevant posts in user's industry
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @param {number} count - Number of posts to like
 */
export async function autoLikePosts(userId, businessProfile, count = 10) {
  try {
    console.log(`👍 Auto-liking ${count} relevant posts...`);
    
    // Check rate limits
    const canLike = await checkRateLimit(userId, 'likes', RATE_LIMITS.likes_per_hour);
    if (!canLike) {
      console.log('⚠️ Rate limit reached for likes');
      return { success: false, reason: 'rate_limit' };
    }
    
    // In production, this would call social media APIs to find and like posts
    // For now, we'll simulate the action
    const liked = [];
    
    for (let i = 0; i < Math.min(count, RATE_LIMITS.likes_per_hour); i++) {
      // Log engagement action
      await logEngagementAction(userId, 'like', {
        platform: 'instagram', // Example
        success: true
      });
      
      liked.push({
        action: 'like',
        platform: 'instagram',
        timestamp: new Date().toISOString()
      });
      
      // Human-like delay
      await delay(randomDelay(2000, 5000));
    }
    
    console.log(`✅ Liked ${liked.length} posts`);
    return { success: true, count: liked.length, actions: liked };
    
  } catch (error) {
    console.error('Error auto-liking posts:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Auto-comment on relevant posts
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @param {array} targetPosts - Posts to comment on
 */
export async function autoCommentOnPosts(userId, businessProfile, targetPosts = []) {
  try {
    console.log(`💬 Auto-commenting on ${targetPosts.length} posts...`);
    
    // Check rate limits
    const canComment = await checkRateLimit(userId, 'comments', RATE_LIMITS.comments_per_hour);
    if (!canComment) {
      console.log('⚠️ Rate limit reached for comments');
      return { success: false, reason: 'rate_limit' };
    }
    
    const commented = [];
    
    for (const post of targetPosts.slice(0, RATE_LIMITS.comments_per_hour)) {
      // Generate relevant comment
      const comment = await generateEngagementComment(post.content, businessProfile);
      
      // In production, post comment via API
      // For now, log the action
      await logEngagementAction(userId, 'comment', {
        platform: post.platform,
        comment: comment,
        success: true
      });
      
      commented.push({
        action: 'comment',
        platform: post.platform,
        comment: comment,
        timestamp: new Date().toISOString()
      });
      
      // Human-like delay
      await delay(randomDelay(10000, 20000));
    }
    
    console.log(`✅ Commented on ${commented.length} posts`);
    return { success: true, count: commented.length, actions: commented };
    
  } catch (error) {
    console.error('Error auto-commenting:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Auto-follow relevant accounts
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @param {array} targetAccounts - Accounts to follow
 */
export async function autoFollowAccounts(userId, businessProfile, targetAccounts = []) {
  try {
    console.log(`👥 Auto-following ${targetAccounts.length} relevant accounts...`);
    
    // Check rate limits
    const canFollow = await checkRateLimit(userId, 'follows', RATE_LIMITS.follows_per_hour);
    if (!canFollow) {
      console.log('⚠️ Rate limit reached for follows');
      return { success: false, reason: 'rate_limit' };
    }
    
    const followed = [];
    
    for (const account of targetAccounts.slice(0, RATE_LIMITS.follows_per_hour)) {
      // In production, follow via API
      await logEngagementAction(userId, 'follow', {
        platform: account.platform,
        account: account.username,
        success: true
      });
      
      followed.push({
        action: 'follow',
        platform: account.platform,
        account: account.username,
        timestamp: new Date().toISOString()
      });
      
      // Human-like delay
      await delay(randomDelay(5000, 10000));
    }
    
    console.log(`✅ Followed ${followed.length} accounts`);
    return { success: true, count: followed.length, actions: followed };
    
  } catch (error) {
    console.error('Error auto-following:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Auto-respond to common DMs/comments
 * @param {string} userId - User ID
 * @param {object} businessProfile - Business profile
 * @param {array} messages - Messages to respond to
 */
export async function autoRespondToMessages(userId, businessProfile, messages = []) {
  try {
    console.log(`📨 Auto-responding to ${messages.length} messages...`);
    
    const responses = [];
    
    for (const message of messages) {
      // Check if it's a common question
      const isCommonQuestion = detectCommonQuestion(message.content);
      
      if (isCommonQuestion) {
        // Generate appropriate response
        const response = await generateMessageResponse(message.content, businessProfile);
        
        responses.push({
          messageId: message.id,
          response: response,
          automated: true,
          timestamp: new Date().toISOString()
        });
        
        // Log the action
        await logEngagementAction(userId, 'auto_response', {
          message: message.content.substring(0, 50),
          response: response.substring(0, 50)
        });
      }
    }
    
    console.log(`✅ Responded to ${responses.length} messages`);
    return { success: true, count: responses.length, responses };
    
  } catch (error) {
    console.error('Error auto-responding:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Detect if message contains common question
 */
function detectCommonQuestion(message) {
  const commonQuestions = [
    'hours',
    'open',
    'location',
    'address',
    'price',
    'cost',
    'how much',
    'available',
    'in stock',
    'delivery',
    'shipping'
  ];
  
  const lowerMessage = message.toLowerCase();
  return commonQuestions.some(q => lowerMessage.includes(q));
}

/**
 * Generate response to message
 */
async function generateMessageResponse(message, businessProfile) {
  try {
    const prompt = `Generate a helpful, professional response to this customer message.

Message: ${message}

Business: ${businessProfile.businessName}
Phone: ${businessProfile.phone}
Website: ${businessProfile.website}
Address: ${businessProfile.address || 'Contact us for location'}

Requirements:
- Direct and helpful answer
- Include relevant contact info if needed
- Professional and friendly
- 2-3 sentences max
- End with invitation to contact for more info

Write only the response:`;

    const response = await generateContentWithGemini(prompt, 'text', businessProfile);
    return response.trim();
    
  } catch (error) {
    return `Thanks for reaching out! Please contact us at ${businessProfile.phone || businessProfile.email || 'our website'} for more information.`;
  }
}

/**
 * Check rate limit for engagement action
 */
async function checkRateLimit(userId, actionType, hourlyLimit) {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const { data, error } = await supabase
      .from('engagement_actions')
      .select('id')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .gte('created_at', oneHourAgo.toISOString());
    
    if (error) throw error;
    
    return (data?.length || 0) < hourlyLimit;
    
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return false; // Err on the side of caution
  }
}

/**
 * Log engagement action
 */
async function logEngagementAction(userId, actionType, metadata = {}) {
  try {
    const { error } = await supabase
      .from('engagement_actions')
      .insert({
        user_id: userId,
        action_type: actionType,
        metadata: metadata,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error logging engagement:', error);
  }
}

/**
 * Random delay for human-like behavior
 */
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Delay helper
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get engagement summary
 * @param {string} userId - User ID
 * @param {number} days - Days to look back
 */
export async function getEngagementSummary(userId, days = 7) {
  try {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    const { data, error } = await supabase
      .from('engagement_actions')
      .select('action_type, created_at')
      .eq('user_id', userId)
      .gte('created_at', daysAgo.toISOString());
    
    if (error) throw error;
    
    const summary = {
      likes: 0,
      comments: 0,
      follows: 0,
      responses: 0,
      total: data?.length || 0
    };
    
    (data || []).forEach(action => {
      if (action.action_type === 'like') summary.likes++;
      if (action.action_type === 'comment') summary.comments++;
      if (action.action_type === 'follow') summary.follows++;
      if (action.action_type === 'auto_response') summary.responses++;
    });
    
    return summary;
    
  } catch (error) {
    console.error('Error getting engagement summary:', error);
    return { likes: 0, comments: 0, follows: 0, responses: 0, total: 0 };
  }
}

export default {
  generateEngagementComment,
  autoLikePosts,
  autoCommentOnPosts,
  autoFollowAccounts,
  autoRespondToMessages,
  getEngagementSummary,
  RATE_LIMITS
};
