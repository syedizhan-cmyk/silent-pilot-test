// Automatic Content Generation Engine
import { generateContentWithGemini } from './gemini';
import { generateContent as generateContentWithOpenAI } from './openai';
import { generateAIImage } from './mediaGenerator';
import { enrichBusinessProfile, buildEnhancedBusinessContext, getEnrichedContentIdeas } from './brandIntelligence';
import { getPerformanceOverview, getThemePerformance, getContentRecommendations } from './performanceAnalytics';

// Content Strategy Templates by Industry
const industryStrategies = {
  technology: {
    topics: [
      'Latest tech trends', 'Innovation updates', 'Product features',
      'Tech tips', 'Industry news', 'Case studies', 'Best practices',
      'Tutorials', 'Problem-solving', 'Future predictions'
    ],
    contentMix: { educational: 40, promotional: 20, engagement: 30, news: 10 },
    postingFrequency: 5, // posts per week
    bestTimes: ['09:00', '13:00', '17:00']
  },
  healthcare: {
    topics: [
      'Health tips', 'Wellness advice', 'Patient stories', 'Medical innovations',
      'Preventive care', 'Seasonal health', 'FAQ answers', 'Team spotlights',
      'Community health', 'Research updates'
    ],
    contentMix: { educational: 50, promotional: 15, engagement: 25, trust: 10 },
    postingFrequency: 4,
    bestTimes: ['08:00', '12:00', '18:00']
  },
  finance: {
    topics: [
      'Money tips', 'Investment advice', 'Market updates', 'Financial planning',
      'Tax tips', 'Savings strategies', 'Economic news', 'Success stories',
      'Risk management', 'Retirement planning'
    ],
    contentMix: { educational: 45, promotional: 20, engagement: 25, news: 10 },
    postingFrequency: 4,
    bestTimes: ['08:00', '12:00', '16:00']
  },
  retail: {
    topics: [
      'New arrivals', 'Style tips', 'Customer stories', 'Behind the scenes',
      'Seasonal trends', 'How-to guides', 'Product highlights', 'Special offers',
      'User generated content', 'Brand values'
    ],
    contentMix: { promotional: 35, engagement: 35, educational: 20, lifestyle: 10 },
    postingFrequency: 7,
    bestTimes: ['10:00', '14:00', '19:00']
  },
  education: {
    topics: [
      'Learning tips', 'Student success', 'Course highlights', 'Industry insights',
      'Career advice', 'Study techniques', 'Faculty spotlights', 'Alumni stories',
      'Educational trends', 'Resource recommendations'
    ],
    contentMix: { educational: 50, engagement: 25, promotional: 15, inspiration: 10 },
    postingFrequency: 5,
    bestTimes: ['09:00', '13:00', '17:00']
  },
  manufacturing: {
    topics: [
      'Product quality', 'Innovation showcase', 'Process transparency',
      'Industry standards', 'Sustainability', 'Team excellence', 'Case studies',
      'Technology adoption', 'Safety first', 'Customer success'
    ],
    contentMix: { educational: 35, promotional: 30, engagement: 20, trust: 15 },
    postingFrequency: 3,
    bestTimes: ['08:00', '12:00', '16:00']
  },
  'real-estate': {
    topics: [
      'Market updates', 'Property tips', 'Buying guides', 'Selling advice',
      'Neighborhood spotlights', 'Home staging', 'Investment insights',
      'Success stories', 'Market trends', 'Client testimonials'
    ],
    contentMix: { educational: 35, promotional: 30, engagement: 25, news: 10 },
    postingFrequency: 5,
    bestTimes: ['09:00', '13:00', '18:00']
  },
  consulting: {
    topics: [
      'Industry insights', 'Best practices', 'Thought leadership',
      'Problem solving', 'Trend analysis', 'Success strategies',
      'Case studies', 'Expert tips', 'Business growth', 'Innovation'
    ],
    contentMix: { educational: 50, thought_leadership: 25, promotional: 15, engagement: 10 },
    postingFrequency: 4,
    bestTimes: ['08:00', '12:00', '17:00']
  },
  marketing: {
    topics: [
      'Marketing strategies', 'Campaign ideas', 'Social media tips',
      'Content creation', 'Analytics insights', 'Tool reviews',
      'Trend predictions', 'ROI optimization', 'Brand building', 'Case studies'
    ],
    contentMix: { educational: 40, promotional: 25, engagement: 25, news: 10 },
    postingFrequency: 6,
    bestTimes: ['09:00', '13:00', '17:00']
  },
  hospitality: {
    topics: [
      'Guest experiences', 'Local attractions', 'Seasonal specials',
      'Behind the scenes', 'Staff spotlights', 'Travel tips',
      'Events', 'Food & beverage', 'Amenities', 'Guest stories'
    ],
    contentMix: { engagement: 40, promotional: 30, lifestyle: 20, educational: 10 },
    postingFrequency: 6,
    bestTimes: ['10:00', '14:00', '19:00']
  },
  other: {
    topics: [
      'Industry updates', 'Tips and tricks', 'Success stories',
      'Behind the scenes', 'Customer spotlights', 'Value proposition',
      'Problem solving', 'Team culture', 'Innovation', 'Community'
    ],
    contentMix: { educational: 35, engagement: 30, promotional: 25, news: 10 },
    postingFrequency: 4,
    bestTimes: ['09:00', '13:00', '17:00']
  }
};

// Generate content ideas based on business profile
export const generateContentIdeas = async (businessProfile, count = 30, enrichedData = null, userId = null) => {
  const industry = businessProfile.industry || 'other';
  const strategy = industryStrategies[industry] || industryStrategies.other;
  
  const ideas = [];
  
  // Get performance data if available
  let performanceContext = '';
  let topThemes = [];
  
  if (userId) {
    try {
      const [overview, themes, recommendations] = await Promise.all([
        getPerformanceOverview(userId).catch(() => null),
        getThemePerformance(userId).catch(() => []),
        getContentRecommendations(userId).catch(() => [])
      ]);
      
      if (overview && overview.totalPosts > 5) {
        performanceContext = `

## PERFORMANCE INSIGHTS (Use this to optimize content based on what works):
Overall Performance:
- Total Posts: ${overview.totalPosts}
- Average Engagement: ${overview.avgEngagementRate}%
- Top Platform: ${overview.topPlatform}
- Trend: ${overview.trend}

${themes.length > 0 ? `
Top Performing Themes:
${themes.slice(0, 5).map((t, i) => `${i + 1}. "${t.theme_name}" - ${Math.round(t.avg_engagement_rate)}% engagement (${t.total_posts} posts)`).join('\n')}
` : ''}

${recommendations.length > 0 ? `
AI Recommendations:
${recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r.message}`).join('\n')}
` : ''}

IMPORTANT: Prioritize content ideas similar to top-performing themes. Avoid themes that are declining.`;

        topThemes = themes.slice(0, 3).map(t => t.theme_name);
      }
    } catch (error) {
      console.log('Performance data not available yet:', error.message);
    }
  }
  
  // Build enhanced context if we have enriched data
  let enhancedContext = '';
  if (enrichedData) {
    enhancedContext = `

## REAL BUSINESS INTELLIGENCE (Use this to make content highly relevant and specific):
${enrichedData.websiteData ? `
Website Analysis:
- Title: ${enrichedData.websiteData.title}
- Description: ${enrichedData.websiteData.description}
- Key Services: ${enrichedData.websiteData.services?.join(', ') || 'N/A'}
- Main Topics: ${enrichedData.websiteData.keywords?.join(', ') || 'N/A'}
` : ''}
${enrichedData.brandInsights ? `
Brand Insights:
- Personality: ${enrichedData.brandInsights.personality || 'N/A'}
- Differentiators: ${Array.isArray(enrichedData.brandInsights.differentiators) ? enrichedData.brandInsights.differentiators.join(', ') : enrichedData.brandInsights.differentiators || 'N/A'}
- Content Pillars: ${Array.isArray(enrichedData.brandInsights.contentPillars) ? enrichedData.brandInsights.contentPillars.join(', ') : enrichedData.brandInsights.contentPillars || 'N/A'}
` : ''}
${enrichedData.contentThemes?.length ? `
Relevant Content Themes:
${enrichedData.contentThemes.slice(0, 10).map(t => `- ${t.name}${t.description ? ': ' + t.description : ''}`).join('\n')}
` : ''}`;
  }
  
  const prompt = `Generate ${count} HIGHLY SPECIFIC and RELEVANT social media content ideas for this business. Use the real business intelligence AND performance data provided to create content that is unique to this brand and optimized for engagement.

## BUSINESS PROFILE:
Business: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
Products/Services: ${businessProfile.products_services?.map(p => `${p.name} - ${p.description}`).join(', ')}
Target Audience: ${businessProfile.target_audience?.demographics}
Pain Points: ${businessProfile.target_audience?.pain_points?.join(', ')}
Brand Voice: ${businessProfile.brand_voice?.tone}
${enhancedContext}
${performanceContext}

## CONTENT REQUIREMENTS:
- Make each idea SPECIFIC to ${businessProfile.business_name}'s actual products/services/expertise
- Reference their real differentiators and value propositions
- Use insights from their website and brand analysis
${topThemes.length > 0 ? `- PRIORITIZE themes similar to these top performers: ${topThemes.join(', ')}` : ''}
- Avoid generic "tips" or "best practices" - make it about THEIR business
- Content focus areas: ${strategy.topics.join(', ')}
${performanceContext ? '- Apply performance insights to maximize engagement' : ''}

For each idea, provide:
1. **Topic/Theme**: Specific, unique to this business
2. **Content Type**: post, carousel, video, infographic
3. **Key Message**: What specific value does this provide?
4. **Call to Action**: Clear next step
5. **Platform**: LinkedIn, Twitter, Instagram, or Facebook
6. **Why Relevant**: How this ties to their business intelligence

Format as a numbered list with clear sections.`;

  try {
    let response;
    try {
      console.log('Trying Gemini for content ideas...');
      response = await generateContentWithGemini(prompt, 'strategy', '');
    } catch (geminiError) {
      console.warn('Gemini failed, falling back to OpenAI:', geminiError.message);
      response = await generateContentWithOpenAI(prompt, 'strategy');
    }
    return parseContentIdeas(response, businessProfile);
  } catch (error) {
    console.error('All AI providers failed for content ideas:', error);
    // Return default ideas based on industry
    return generateDefaultIdeas(businessProfile, strategy, count);
  }
};

// Parse AI response into structured content ideas
const parseContentIdeas = (response, businessProfile) => {
  console.log('📝 Parsing AI response, length:', response.length);
  
  const lines = response.split('\n');
  const ideas = [];
  let currentIdea = {};
  
  // Default platforms to cycle through if not specified
  const defaultPlatforms = ['linkedin', 'twitter', 'instagram', 'facebook'];
  let platformIndex = 0;
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Look for numbered items (1., 2., etc) or headings with **
    if (line.match(/^\d+\./) || line.match(/^\*\*\d+/)) {
      if (currentIdea.topic) ideas.push(currentIdea);
      currentIdea = { 
        topic: line.replace(/^\d+\./, '').replace(/^\*\*\d+\.?\*\*/, '').trim().replace(/^\*\*/, '').replace(/\*\*$/, '')
      };
    } else if (line.toLowerCase().includes('content type:') || line.toLowerCase().includes('type:')) {
      currentIdea.type = line.split(':')[1]?.trim().toLowerCase() || 'post';
    } else if (line.toLowerCase().includes('platform:')) {
      const platformText = line.split(':')[1]?.trim().toLowerCase() || '';
      // Extract just the platform name (linkedin, twitter, etc.)
      const platform = platformText.split(/[,\s]/)[0] || 'linkedin';
      currentIdea.platform = platform.replace(/[^a-z]/g, '');
    } else if (line.toLowerCase().includes('message:') || line.toLowerCase().includes('key message:')) {
      currentIdea.message = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().includes('cta:') || line.toLowerCase().includes('call to action:')) {
      currentIdea.cta = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().includes('topic') && line.includes(':')) {
      // Handle "Topic/Theme: xyz" format
      if (!currentIdea.topic) {
        currentIdea.topic = line.split(':')[1]?.trim();
      }
    }
  });
  
  if (currentIdea.topic) ideas.push(currentIdea);
  
  console.log('✅ Parsed ideas:', ideas.length);
  
  // If parsing failed, try to create ideas from the raw response
  if (ideas.length === 0) {
    console.log('⚠️ Standard parsing failed, trying fallback...');
    // Split by double newlines or numbered sections
    const sections = response.split(/\n\n+|\n(?=\d+\.)/);
    sections.forEach((section, index) => {
      if (section.trim() && section.length > 20) {
        const lines = section.split('\n');
        const topic = lines[0]?.replace(/^\d+\./, '').trim() || `Content Idea ${index + 1}`;
        ideas.push({
          topic: topic.substring(0, 100),
          type: 'post',
          platform: defaultPlatforms[index % defaultPlatforms.length],
          message: section.substring(0, 200),
          cta: 'Learn more'
        });
      }
    });
    console.log('✅ Fallback parsing created:', ideas.length, 'ideas');
  }
  
  // Ensure all ideas have required fields
  return ideas.map((idea, index) => ({
    id: Date.now() + index,
    topic: idea.topic || `Content idea ${index + 1}`,
    type: idea.type || 'post',
    platform: idea.platform || defaultPlatforms[platformIndex++ % defaultPlatforms.length],
    message: idea.message || '',
    cta: idea.cta || 'Learn more',
    businessId: businessProfile.user_id,
    status: 'pending',
    createdAt: new Date().toISOString()
  }));
};

// Generate default content ideas when AI fails
const generateDefaultIdeas = (businessProfile, strategy, count) => {
  const ideas = [];
  const topics = strategy.topics;
  
  for (let i = 0; i < count; i++) {
    const topic = topics[i % topics.length];
    ideas.push({
      id: Date.now() + i,
      topic: `${topic} - ${businessProfile.business_name}`,
      type: ['post', 'carousel', 'video', 'infographic'][i % 4],
      platform: ['linkedin', 'twitter', 'instagram', 'facebook'][i % 4],
      message: `Share insights about ${topic.toLowerCase()}`,
      cta: 'Learn more',
      businessId: businessProfile.user_id,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  }
  
  return ideas;
};

// Generate full content from idea
export const generateFullContent = async (idea, businessProfile, enrichedData = null) => {
  // Use enhanced business context if available
  const businessContext = enrichedData 
    ? buildEnhancedBusinessContext(businessProfile, enrichedData)
    : `
Business: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
Products/Services: ${businessProfile.products_services?.map(p => `${p.name} - ${p.description}`).join(', ')}
Target Audience: ${businessProfile.target_audience?.demographics}
Pain Points: ${businessProfile.target_audience?.pain_points?.join(', ')}
Brand Voice: ${businessProfile.brand_voice?.tone} and ${businessProfile.brand_voice?.style}
Brand Values: ${businessProfile.brand_values?.join(', ')}
  `.trim();
  
  const prompt = `Create a complete ${idea.platform} post about: ${idea.topic}

${idea.message ? `Key message: ${idea.message}` : ''}
${idea.cta ? `Call to action: ${idea.cta}` : ''}

CRITICAL REQUIREMENTS:
- Make it SPECIFIC to ${businessProfile.business_name} - reference their actual products, services, or expertise
- Use insights from the business intelligence provided in the context
- Make it engaging and valuable for their specific target audience
- Match the brand voice (${businessProfile.brand_voice?.tone})
- Include relevant emojis that fit the brand
- Add 5-8 relevant hashtags (mix of industry and brand-specific)
- Keep it platform-appropriate for ${idea.platform}
- Include a clear call to action
- Ready to post (no explanations, just the content)
- DO NOT use generic templates - make it authentic to this brand

Generate the complete post:`;

  try {
    let content;
    try {
      console.log('Trying Gemini for full content...');
      content = await generateContentWithGemini(prompt, idea.platform, businessContext);
    } catch (geminiError) {
      console.warn('Gemini failed, falling back to OpenAI:', geminiError.message);
      content = await generateContentWithOpenAI(prompt, idea.platform);
    }
    
    // Generate image if needed
    let imageUrl = null;
    const platform = idea.platform?.toLowerCase() || 'linkedin';
    if (['instagram', 'facebook'].includes(platform) || idea.type === 'image') {
      try {
        const imagePrompt = `Professional ${idea.topic} for ${businessProfile.business_name}, ${businessProfile.brand_voice?.tone} style`;
        const imageResult = await generateAIImage(imagePrompt, businessContext, 'professional');
        imageUrl = imageResult.imageUrl;
      } catch (imageError) {
        console.log('Image generation skipped:', imageError.message);
      }
    }
    
    return {
      content,
      imageUrl,
      platform: idea.platform,
      type: idea.type,
      scheduledFor: null, // Will be set by scheduler
      status: 'generated',
      ideaId: idea.id
    };
  } catch (error) {
    console.error('Error generating full content:', error);
    throw error;
  }
};

// Smart scheduling algorithm
export const scheduleContent = (contents, businessProfile, startDate = new Date()) => {
  const industry = businessProfile.industry || 'other';
  const strategy = industryStrategies[industry] || industryStrategies.other;
  
  const scheduled = [];
  const bestTimes = strategy.bestTimes;
  const postsPerWeek = strategy.postingFrequency;
  
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0); // Start at beginning of day
  
  let contentIndex = 0;
  let postsThisWeek = 0;
  let currentWeekStart = new Date(currentDate);
  
  // Calculate days between posts
  const daysInWeek = 7;
  const daysPerPost = Math.floor(daysInWeek / postsPerWeek);
  const remainder = daysInWeek % postsPerWeek;
  
  console.log(`📅 Scheduling strategy: ${postsPerWeek} posts/week across ${daysInWeek} days`);
  
  // Schedule content over multiple weeks
  while (contentIndex < contents.length) {
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const isB2B = ['technology', 'finance', 'consulting', 'manufacturing'].includes(industry);
    
    // Skip weekends for B2B industries
    if (isWeekend && isB2B) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Determine posting time (rotate through best times)
    const timeIndex = contentIndex % bestTimes.length;
    const [hours, minutes] = bestTimes[timeIndex].split(':').map(Number);
    
    const scheduledDate = new Date(currentDate);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Only schedule if in the future
    if (scheduledDate > new Date()) {
      scheduled.push({
        ...contents[contentIndex],
        scheduledFor: scheduledDate.toISOString(),
        status: 'scheduled'
      });
      console.log(`   Post ${contentIndex + 1}: ${scheduledDate.toLocaleDateString()} at ${hours}:${String(minutes).padStart(2, '0')}`);
      contentIndex++;
      postsThisWeek++;
    } else {
      // If in the past, skip to tomorrow
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Check if we've completed a week
    const daysSinceWeekStart = Math.floor((currentDate - currentWeekStart) / (1000 * 60 * 60 * 24));
    if (daysSinceWeekStart >= 7 || postsThisWeek >= postsPerWeek) {
      // Start new week
      postsThisWeek = 0;
      currentWeekStart = new Date(currentDate);
      currentWeekStart.setDate(currentWeekStart.getDate() + 1);
      currentDate = new Date(currentWeekStart);
    } else {
      // Move to next posting day (spread posts evenly throughout week)
      const skipDays = daysPerPost + (postsThisWeek < remainder ? 1 : 0);
      currentDate.setDate(currentDate.getDate() + Math.max(1, skipDays));
    }
  }
  
  console.log(`✅ Scheduled ${scheduled.length} posts from ${scheduled[0]?.scheduledFor} to ${scheduled[scheduled.length - 1]?.scheduledFor}`);
  
  return scheduled;
};

// Auto-generate content calendar with brand intelligence
export const autoGenerateContentCalendar = async (businessProfile, weeks = 4, options = {}) => {
  try {
    console.log('🤖 Starting automatic content calendar generation...');
    
    const onProgress = options.onProgress || (() => {}); // Progress callback
    const uploadedMedia = options.uploadedMedia || [];
    
    // Step 0: Use provided enriched data or gather new intelligence
    onProgress(5, 'Initializing content generation...');
    let enrichedData = options.enrichedData || null;
    
    if (!enrichedData && options.enableWebCrawling !== false) {
      try {
        onProgress(10, 'Gathering brand intelligence from the web...');
        console.log('🔍 Gathering brand intelligence from the web...');
        enrichedData = await enrichBusinessProfile(businessProfile);
        console.log('✅ Brand intelligence gathered successfully!');
      } catch (error) {
        console.warn('⚠️ Web intelligence gathering failed, continuing with basic profile:', error.message);
      }
    } else if (enrichedData) {
      console.log('✅ Using cached brand intelligence!');
    }
    
    // Step 1: Generate content ideas with enriched data
    onProgress(20, 'Generating content ideas...');
    const industry = businessProfile.industry || 'other';
    const strategy = industryStrategies[industry] || industryStrategies.other;
    const totalPosts = weeks * strategy.postingFrequency;
    
    console.log(`📊 Total posts needed: ${totalPosts}`);
    console.log(`📸 User uploaded media: ${uploadedMedia.length}`);
    
    // Calculate posts from media vs AI-generated
    const mediaPostsCount = Math.min(uploadedMedia.length, totalPosts);
    const aiGeneratedPostsCount = totalPosts - mediaPostsCount;
    
    console.log(`   - Posts with user media: ${mediaPostsCount}`);
    console.log(`   - AI-generated posts: ${aiGeneratedPostsCount}`);
    
    const contents = [];
    
    // Step 2A: Generate posts from uploaded media first
    if (uploadedMedia.length > 0) {
      onProgress(25, `Creating posts from uploaded media...`);
      console.log('📸 Generating posts from uploaded media...');
      
      // Import generatePostFromMedia
      const { generatePostFromMedia } = require('./visionAnalyzer');
      
      for (let i = 0; i < mediaPostsCount; i++) {
        try {
          const media = uploadedMedia[i];
          const progressPercent = 25 + Math.floor((i / totalPosts) * 30);
          onProgress(progressPercent, `Creating post from media ${i + 1}/${mediaPostsCount}...`);
          
          // Determine best platform for this media
          const suggestedPlatforms = media.analysis.platforms || ['instagram', 'facebook'];
          const platform = suggestedPlatforms[0];
          
          console.log(`   Creating ${platform} post from ${media.fileName}...`);
          
          // Generate caption using AI based on media analysis
          const caption = await generatePostFromMedia(media.analysis, platform, businessProfile);
          
          // Upload media to storage and get URL
          const mediaUrl = await uploadMediaToStorage(media.file, businessProfile.user_id);
          
          contents.push({
            content: caption,
            platform: platform,
            type: media.fileType.startsWith('image/') ? 'image' : 'video',
            imageUrl: mediaUrl,
            status: 'generated',
            source: 'user_media',
            mediaFileName: media.fileName
          });
          
          console.log(`✅ Created post ${i + 1}/${mediaPostsCount} from media`);
          
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to create post from media ${i}:`, error);
        }
      }
    }
    
    // Step 2B: Generate AI content ideas for remaining posts
    if (aiGeneratedPostsCount > 0) {
      onProgress(55, `Generating ${aiGeneratedPostsCount} additional content ideas...`);
      console.log(`📝 Generating ${aiGeneratedPostsCount} AI content ideas...`);
      const ideas = await generateContentIdeas(businessProfile, aiGeneratedPostsCount, enrichedData, options.userId || null);
      
      // Generate full content for each idea
      for (let i = 0; i < Math.min(ideas.length, aiGeneratedPostsCount); i++) {
        try {
          // Calculate progress: 55% to 90% of progress bar
          const progressPercent = 55 + Math.floor((i / aiGeneratedPostsCount) * 35);
          onProgress(progressPercent, `Generating AI content ${i + 1}/${aiGeneratedPostsCount}...`);
          
          const content = await generateFullContent(ideas[i], businessProfile, enrichedData);
          contents.push(content);
          console.log(`Generated AI content ${i + 1}/${aiGeneratedPostsCount}`);
        
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate AI content for idea ${i}:`, error);
        }
      }
    }
    
    console.log(`\n📊 CONTENT GENERATION SUMMARY:`);
    console.log(`   Total posts created: ${contents.length}`);
    console.log(`   - From user media: ${mediaPostsCount}`);
    console.log(`   - AI generated: ${contents.length - mediaPostsCount}`);
    
    if (contents.length === 0) {
      throw new Error('Failed to generate any content. Please try again.');
    }
    
    // Step 3: Schedule content optimally
    onProgress(95, 'Scheduling content...');
    console.log('Scheduling content...');
    const scheduledContent = scheduleContent(contents, businessProfile);
    
    onProgress(100, `✅ Generated ${scheduledContent.length} posts!`);
    console.log(`✅ Generated and scheduled ${scheduledContent.length} posts!`);
    
    return {
      success: true,
      ideas: mediaPostsCount + aiGeneratedPostsCount,
      generated: contents.length,
      scheduled: scheduledContent.length,
      content: scheduledContent,
      strategy: strategy,
      enrichedData: enrichedData // Include enriched data in response
    };
  } catch (error) {
    console.error('Error in auto content generation:', error);
    throw error;
  }
};
/**
 * Upload media file to Supabase storage
 * @param {File} file - File object
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Public URL of uploaded media
 */
const uploadMediaToStorage = async (file, userId) => {
  try {
    const { supabase } = require('./supabase');
    
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Storage upload error:', error);
      // Fallback: use object URL (temporary)
      return URL.createObjectURL(file);
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);
    
    console.log(`✅ Uploaded media to storage: ${fileName}`);
    return urlData.publicUrl;
    
  } catch (error) {
    console.error('Error uploading media:', error);
    // Fallback to object URL
    return URL.createObjectURL(file);
  }
};
