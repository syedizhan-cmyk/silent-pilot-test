// Enhanced Automatic Content Generation Engine V2
// Complete marketing automation with images, hashtags, content variety

import { generateContentWithGemini } from './gemini';
import { generateAIImage } from './mediaGenerator';
import { generateHashtags, formatHashtags } from './hashtagGenerator';
import { 
  calculateContentMix, 
  generateContentIdeas as generateVarietyIdeas, 
  generateCompletePost as generateVarietyPost,
  getOptimalPostingTimes 
} from './contentVarietyEngine';

/**
 * Enhanced Auto-Generate Content Calendar with full automation
 * @param {object} businessProfile - User's business profile
 * @param {number} weeks - Number of weeks to generate
 * @param {function} onProgress - Progress callback
 * @returns {Promise<object>} Generated content calendar
 */
export const autoGenerateContentCalendarV2 = async (businessProfile, weeks = 4, onProgress = null) => {
  try {
    console.log('🚀 Starting Enhanced AutoPilot Content Generation...');
    
    // Calculate total posts (2 per day)
    const totalPosts = weeks * 7 * 2; // 2 posts per day
    
    // Determine content mix (40% educational, 20% promotional, etc.)
    const contentMix = calculateContentMix(totalPosts);
    console.log('📊 Content Mix:', contentMix);
    
    if (onProgress) onProgress({ stage: 'planning', progress: 10, message: 'Planning content strategy...' });
    
    // Generate content ideas for each type
    const allIdeas = {
      educational: [],
      promotional: [],
      engagement: [],
      testimonial: [],
      behindScenes: []
    };
    
    console.log('💡 Generating content ideas for each type...');
    for (const [type, count] of Object.entries(contentMix)) {
      if (count > 0) {
        console.log(`  - ${type}: ${count} ideas`);
        const ideas = await generateVarietyIdeas(businessProfile, type, count);
        allIdeas[type] = ideas;
      }
    }
    
    if (onProgress) onProgress({ stage: 'ideas', progress: 30, message: `Generated ${totalPosts} content ideas...` });
    
    // Flatten all ideas with their types
    const allContentItems = [];
    for (const [type, ideas] of Object.entries(allIdeas)) {
      ideas.forEach(idea => {
        allContentItems.push({ idea, type });
      });
    }
    
    // Shuffle to mix content types throughout the calendar
    shuffleArray(allContentItems);
    
    console.log('✍️ Creating full posts with captions, images, and hashtags...');
    
    // Generate complete posts
    const generatedContent = [];
    const platforms = businessProfile.platforms || ['facebook', 'instagram', 'linkedin', 'twitter'];
    const startDate = new Date();
    
    for (let i = 0; i < allContentItems.length; i++) {
      const { idea, type } = allContentItems[i];
      
      // Select platform (rotate through available platforms)
      const platform = platforms[i % platforms.length];
      
      try {
        // Generate complete post with content and CTA
        console.log(`  📝 Post ${i + 1}/${totalPosts}: ${type} for ${platform}`);
        const post = await generateVarietyPost(idea, type, businessProfile, platform);
        
        // Generate hashtags
        console.log(`  #️⃣ Generating hashtags...`);
        const hashtags = await generateHashtags(
          post.content, 
          businessProfile.industry, 
          platform, 
          businessProfile
        );
        
        // Generate image
        console.log(`  🎨 Generating image...`);
        let imageUrl = null;
        try {
          const imagePrompt = `${idea.substring(0, 100)}, ${businessProfile.industry}, professional, high quality`;
          const imageResult = await generateAIImage(imagePrompt, null, 'professional');
          imageUrl = imageResult.success ? imageResult.imageUrl : null;
        } catch (imgError) {
          console.log(`  ⚠️ Image generation failed, will use placeholder`);
        }
        
        // Calculate posting time
        const postingTimes = getOptimalPostingTimes(platform, businessProfile.industry);
        const dayIndex = Math.floor(i / 2); // 2 posts per day
        const timeSlot = i % 2; // 0 = first post of day, 1 = second post
        const scheduledDate = new Date(startDate);
        scheduledDate.setDate(scheduledDate.getDate() + dayIndex);
        
        // Set time based on optimal times
        const [hour, minute] = postingTimes.default[timeSlot % postingTimes.default.length].split(':');
        scheduledDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
        
        // Combine everything
        const fullCaption = `${post.fullPost}${formatHashtags(hashtags, platform)}`;
        
        generatedContent.push({
          content: fullCaption,
          caption: post.content,
          cta: post.cta,
          hashtags: hashtags,
          imageUrl: imageUrl,
          imagePrompt: idea.substring(0, 100),
          platform: platform,
          contentType: type,
          contentTypeEmoji: post.contentTypeEmoji,
          scheduledFor: scheduledDate.toISOString(),
          type: type,
          status: 'scheduled'
        });
        
        if (onProgress) {
          const progress = 30 + Math.floor((i / totalPosts) * 60);
          onProgress({ 
            stage: 'generating', 
            progress, 
            message: `Created ${i + 1}/${totalPosts} complete posts...` 
          });
        }
        
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (postError) {
        console.error(`Error generating post ${i + 1}:`, postError);
        // Create basic fallback post
        generatedContent.push({
          content: idea,
          caption: idea,
          cta: `Learn more: ${businessProfile.website || ''}`,
          hashtags: [],
          imageUrl: null,
          platform: platform,
          contentType: type,
          scheduledFor: new Date(startDate.getTime() + (i * 12 * 60 * 60 * 1000)).toISOString(),
          type: type,
          status: 'scheduled'
        });
      }
    }
    
    if (onProgress) onProgress({ stage: 'complete', progress: 100, message: 'Content calendar ready!' });
    
    console.log('✅ Content generation complete!');
    console.log(`📅 Generated ${generatedContent.length} posts over ${weeks} weeks`);
    console.log(`📊 Content breakdown:`, contentMix);
    
    return {
      success: true,
      content: generatedContent,
      scheduled: generatedContent.length,
      weeks: weeks,
      platforms: platforms,
      contentMix: contentMix,
      summary: `Generated ${generatedContent.length} complete posts with images, hashtags, and CTAs`
    };
    
  } catch (error) {
    console.error('Error in auto-generate content calendar:', error);
    throw new Error('Failed to generate content calendar: ' + error.message);
  }
};

/**
 * Shuffle array in place
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Generate single enhanced post on demand
 */
export const generateEnhancedPost = async (topic, businessProfile, platform = 'instagram') => {
  try {
    // Determine content type based on topic
    const contentType = determineContentType(topic);
    
    // Generate complete post
    const post = await generateVarietyPost(topic, contentType, businessProfile, platform);
    
    // Generate hashtags
    const hashtags = await generateHashtags(post.content, businessProfile.industry, platform, businessProfile);
    
    // Generate image
    let imageUrl = null;
    try {
      const imageResult = await generateAIImage(topic, null, 'professional');
      imageUrl = imageResult.success ? imageResult.imageUrl : null;
    } catch (error) {
      console.log('Image generation failed');
    }
    
    return {
      success: true,
      content: post.fullPost,
      caption: post.content,
      cta: post.cta,
      hashtags: hashtags,
      hashtagString: formatHashtags(hashtags, platform),
      imageUrl: imageUrl,
      platform: platform,
      contentType: contentType
    };
    
  } catch (error) {
    console.error('Error generating enhanced post:', error);
    throw error;
  }
};

/**
 * Determine content type from topic keywords
 */
function determineContentType(topic) {
  const lower = topic.toLowerCase();
  
  if (lower.includes('how to') || lower.includes('tip') || lower.includes('guide')) {
    return 'educational';
  } else if (lower.includes('special') || lower.includes('offer') || lower.includes('sale')) {
    return 'promotional';
  } else if (lower.includes('question') || lower.includes('poll') || lower.includes('what')) {
    return 'engagement';
  } else if (lower.includes('review') || lower.includes('testimonial') || lower.includes('success')) {
    return 'testimonial';
  } else if (lower.includes('team') || lower.includes('behind') || lower.includes('office')) {
    return 'behindScenes';
  }
  
  return 'educational'; // default
}

export default {
  autoGenerateContentCalendarV2,
  generateEnhancedPost
};
