// Automatic Content Generation Engine
import { generateContentWithGemini } from './gemini';
import { generateAIImage } from './mediaGenerator';

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
export const generateContentIdeas = async (businessProfile, count = 30) => {
  const industry = businessProfile.industry || 'other';
  const strategy = industryStrategies[industry] || industryStrategies.other;
  
  const ideas = [];
  
  const prompt = `Generate ${count} specific, actionable social media content ideas for this business:

Business: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
Products/Services: ${businessProfile.products_services?.map(p => p.name).join(', ')}
Target Audience: ${businessProfile.target_audience?.demographics}
Brand Voice: ${businessProfile.brand_voice?.tone}

Content focus areas: ${strategy.topics.join(', ')}

For each idea, provide:
1. Topic/Theme
2. Content type (post, carousel, video, infographic)
3. Key message
4. Call to action
5. Best platform (LinkedIn, Twitter, Instagram, Facebook)

Format as a numbered list with clear sections.`;

  try {
    const response = await generateContentWithGemini(prompt, 'strategy', '');
    return parseContentIdeas(response, businessProfile);
  } catch (error) {
    console.error('Error generating content ideas with AI, using default ideas:', error);
    // Return default ideas based on industry
    return generateDefaultIdeas(businessProfile, strategy, count);
  }
};

// Parse AI response into structured content ideas
const parseContentIdeas = (response, businessProfile) => {
  const lines = response.split('\n');
  const ideas = [];
  let currentIdea = {};
  
  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    // Simple parsing - in production, use more robust parsing
    if (line.match(/^\d+\./)) {
      if (currentIdea.topic) ideas.push(currentIdea);
      currentIdea = { topic: line.replace(/^\d+\./, '').trim() };
    } else if (line.toLowerCase().includes('type:')) {
      currentIdea.type = line.split(':')[1]?.trim() || 'post';
    } else if (line.toLowerCase().includes('platform:')) {
      currentIdea.platform = line.split(':')[1]?.trim() || 'linkedin';
    } else if (line.toLowerCase().includes('message:')) {
      currentIdea.message = line.split(':')[1]?.trim();
    } else if (line.toLowerCase().includes('cta:') || line.toLowerCase().includes('call to action:')) {
      currentIdea.cta = line.split(':')[1]?.trim();
    }
  });
  
  if (currentIdea.topic) ideas.push(currentIdea);
  
  return ideas.map((idea, index) => ({
    id: Date.now() + index,
    ...idea,
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
export const generateFullContent = async (idea, businessProfile) => {
  const businessContext = `
Business: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
Products/Services: ${businessProfile.products_services?.map(p => `${p.name} - ${p.description}`).join(', ')}
Target Audience: ${businessProfile.target_audience?.demographics}
Pain Points: ${businessProfile.target_audience?.pain_points?.join(', ')}
Brand Voice: ${businessProfile.brand_voice?.tone} and ${businessProfile.brand_voice?.style}
Brand Values: ${businessProfile.brand_values?.join(', ')}
  `.trim();
  
  const prompt = `Create a ${idea.platform} post about: ${idea.topic}

${idea.message ? `Key message: ${idea.message}` : ''}
${idea.cta ? `Call to action: ${idea.cta}` : ''}

CRITICAL: Generate ONLY the actual post content. NO meta-commentary, NO explanations, NO "Here's your post" phrases.

Requirements:
- Start directly with the post content
- Match brand voice: ${businessProfile.brand_voice?.tone}
- Include relevant emojis naturally
- Add 5-8 relevant hashtags at the end
- Platform-appropriate length for ${idea.platform}
- Clear call to action
- Engaging and valuable

Write the post now (content only):`;

  try {
    let content = await generateContentWithGemini(prompt, idea.platform, businessContext);
    
    // Clean up the content - remove meta-commentary
    content = content
      .replace(/^(Here's|Here is|Here are).*(post|content)[:\-\s]*/i, '')
      .replace(/^(I've created|I created|Check out|Below is|This is).*(post|content)[:\-\s]*/i, '')
      .replace(/^\*\*.*\*\*\s*/gm, '') // Remove markdown headers at start
      .replace(/^---+\s*/gm, '') // Remove separator lines
      .replace(/^###?\s+\*\*.*\*\*\s*/gm, '') // Remove markdown headers
      .trim();
    
    // Generate image for all visual platforms
    let imageUrl = null;
    const visualPlatforms = ['instagram', 'facebook', 'linkedin', 'twitter'];
    if (visualPlatforms.includes(idea.platform.toLowerCase()) || idea.type === 'image') {
      try {
        const imagePrompt = `${idea.topic}, professional ${businessProfile.brand_voice?.tone} style, ${businessProfile.industry} business, high quality`;
        const imageResult = await generateAIImage(imagePrompt, businessContext, 'professional');
        imageUrl = imageResult.imageUrl;
        console.log('✅ Image generated for', idea.platform);
      } catch (imageError) {
        console.log('⚠️ Image generation failed:', imageError.message);
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
  let contentIndex = 0;
  let weekdayIndex = 0;
  
  // Schedule content over the next 4 weeks
  while (contentIndex < contents.length && scheduled.length < contents.length) {
    // Skip weekends for B2B, include for B2C
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const isB2B = ['technology', 'finance', 'consulting', 'manufacturing'].includes(industry);
    
    if (isWeekend && isB2B) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }
    
    // Determine posting time
    const timeIndex = weekdayIndex % bestTimes.length;
    const [hours, minutes] = bestTimes[timeIndex].split(':').map(Number);
    
    const scheduledDate = new Date(currentDate);
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Don't schedule in the past
    if (scheduledDate > new Date()) {
      scheduled.push({
        ...contents[contentIndex],
        scheduledFor: scheduledDate.toISOString(),
        status: 'scheduled'
      });
      contentIndex++;
    }
    
    weekdayIndex++;
    
    // Move to next day after posting required times
    if (weekdayIndex >= postsPerWeek) {
      weekdayIndex = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return scheduled;
};

// Auto-generate content calendar
export const autoGenerateContentCalendar = async (businessProfile, weeks = 4, onProgress = null) => {
  try {
    console.log('🤖 Starting automatic content calendar generation...');
    
    // Step 1: Generate content ideas
    const industry = businessProfile.industry || 'other';
    const strategy = industryStrategies[industry] || industryStrategies.other;
    const totalPosts = weeks * strategy.postingFrequency;
    
    console.log(`📋 Generating ${totalPosts} content ideas for ${weeks} weeks...`);
    if (onProgress) onProgress({ stage: 'ideas', current: 0, total: totalPosts });
    
    const ideas = await generateContentIdeas(businessProfile, totalPosts);
    console.log(`✅ Generated ${ideas.length} content ideas`);
    
    // Step 2: Generate full content for each idea (in batches to avoid overwhelming)
    console.log('📝 Generating full content from ideas...');
    if (onProgress) onProgress({ stage: 'content', current: 0, total: totalPosts });
    
    const contents = [];
    
    for (let i = 0; i < Math.min(ideas.length, totalPosts); i++) {
      let retries = 0;
      const maxRetries = 2;
      
      while (retries <= maxRetries) {
        try {
          const content = await generateFullContent(ideas[i], businessProfile);
          contents.push(content);
          console.log(`✅ Generated content ${i + 1}/${totalPosts}`);
          if (onProgress) onProgress({ stage: 'content', current: i + 1, total: totalPosts });
          break; // Success, exit retry loop
        } catch (error) {
          retries++;
          
          if (error.message.includes('503') || error.message.includes('overloaded')) {
            if (retries <= maxRetries) {
              console.log(`⏳ API overloaded, retrying in ${retries * 3} seconds... (${retries}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, retries * 3000)); // Exponential backoff
            } else {
              console.error(`❌ Failed after ${maxRetries} retries for idea ${i}:`, error.message);
              // Create a simple text-only post as fallback
              contents.push({
                content: `${ideas[i].topic}\n\n${ideas[i].message || 'Check out our latest updates!'}\n\n${ideas[i].cta || 'Learn more!'}`,
                imageUrl: null,
                platform: ideas[i].platform,
                type: ideas[i].type,
                scheduledFor: null,
                status: 'generated',
                ideaId: ideas[i].id
              });
            }
          } else {
            console.error(`❌ Failed to generate content for idea ${i}:`, error.message);
            break; // Different error, don't retry
          }
        }
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Step 3: Schedule content optimally
    console.log('Scheduling content...');
    const scheduledContent = scheduleContent(contents, businessProfile);
    
    console.log(`✅ Generated and scheduled ${scheduledContent.length} posts!`);
    
    return {
      success: true,
      ideas: ideas.length,
      generated: contents.length,
      scheduled: scheduledContent.length,
      content: scheduledContent,
      strategy: strategy
    };
  } catch (error) {
    console.error('Error in auto content generation:', error);
    throw error;
  }
};