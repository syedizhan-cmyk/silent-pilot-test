// Content Variety Engine
// Generates different types of engaging social media content

import { generateContentWithGemini } from './gemini';

// Content type distribution (percentages)
export const CONTENT_MIX = {
  educational: 0.40,    // 40% - How-tos, tips, insights
  promotional: 0.20,    // 20% - Products, services, offers
  engagement: 0.20,     // 20% - Questions, polls, interactive
  testimonial: 0.10,    // 10% - Customer stories, reviews
  behindScenes: 0.10    // 10% - Team, culture, process
};

// Content templates and prompts for each type
const contentTemplates = {
  educational: {
    name: 'Educational',
    emoji: '💡',
    formats: [
      'How to {action} in {industry}',
      'X tips for {goal}',
      'The ultimate guide to {topic}',
      'Common mistakes in {area} and how to avoid them',
      'Everything you need to know about {subject}',
      'Quick tips: {topic}',
      'Did you know? {fact}',
      'Expert advice: {topic}'
    ],
    ctaTypes: ['learn_more', 'contact', 'download']
  },
  
  promotional: {
    name: 'Promotional',
    emoji: '🎯',
    formats: [
      'Introducing our {product/service}',
      'Special offer: {deal}',
      'New arrival: {product}',
      'Why choose {business} for {need}',
      'Limited time: {offer}',
      'Customer favorite: {product}',
      'Spotlight on {service}',
      'The benefits of {product/service}'
    ],
    ctaTypes: ['shop', 'call', 'book', 'quote']
  },
  
  engagement: {
    name: 'Engagement',
    emoji: '💬',
    formats: [
      'Question: What\'s your {preference}?',
      'Poll: {option A} or {option B}?',
      'Fill in the blank: {statement} ___',
      'This or that: {choice1} vs {choice2}',
      'Comment if you agree: {statement}',
      'Tag someone who {description}',
      'What would you do if {scenario}?',
      'Caption this: {image description}'
    ],
    ctaTypes: ['comment', 'tag', 'share']
  },
  
  testimonial: {
    name: 'Testimonial',
    emoji: '⭐',
    formats: [
      'Customer success story: {result}',
      'What our clients are saying',
      'Real results: {achievement}',
      'Before and after: {transformation}',
      'Meet {customer}: their journey with us',
      '5-star review: {feedback}',
      'Success story: {outcome}',
      'Why customers choose us: {reason}'
    ],
    ctaTypes: ['contact', 'review', 'learn_more']
  },
  
  behindScenes: {
    name: 'Behind the Scenes',
    emoji: '🎬',
    formats: [
      'Meet the team: {person/department}',
      'A day in the life at {business}',
      'Behind the scenes: {process}',
      'How we {create/make/deliver} {product/service}',
      'Office culture at {business}',
      'Team spotlight: {person}',
      'Our workspace: {location/setup}',
      'What goes into {process}'
    ],
    ctaTypes: ['follow', 'join', 'learn_more']
  }
};

// CTA (Call-to-Action) templates
const ctaTemplates = {
  learn_more: ['Learn more: {link}', 'Visit us: {link}', 'Find out more at {link}'],
  contact: ['Contact us: {phone}', 'Get in touch: {email}', 'Call us: {phone}'],
  shop: ['Shop now: {link}', 'Browse our collection: {link}', 'Get yours today: {link}'],
  call: ['Call us at {phone}', 'Book your appointment: {phone}', 'Speak with us: {phone}'],
  book: ['Book now: {link}', 'Schedule your visit: {link}', 'Reserve your spot: {link}'],
  quote: ['Get your free quote: {link}', 'Request a quote: {phone}', 'Free estimate: {phone}'],
  comment: ['Comment below! 👇', 'Let us know in the comments!', 'Share your thoughts below!'],
  tag: ['Tag a friend who needs this!', 'Tag someone who would love this!', 'Share with a friend!'],
  share: ['Share if you agree!', 'Share this with your network!', 'Pass this along!'],
  follow: ['Follow us for more!', 'Follow for daily updates!', 'Follow to stay connected!'],
  join: ['Join our team!', 'We\'re hiring!', 'Careers at {business}'],
  download: ['Download our guide: {link}', 'Get the free resource: {link}', 'Download now: {link}'],
  review: ['Leave us a review!', 'Share your experience!', 'Review us on Google!']
};

/**
 * Determine content mix for a given number of posts
 */
export function calculateContentMix(totalPosts) {
  return {
    educational: Math.floor(totalPosts * CONTENT_MIX.educational),
    promotional: Math.floor(totalPosts * CONTENT_MIX.promotional),
    engagement: Math.floor(totalPosts * CONTENT_MIX.engagement),
    testimonial: Math.floor(totalPosts * CONTENT_MIX.testimonial),
    behindScenes: Math.floor(totalPosts * CONTENT_MIX.behindScenes)
  };
}

/**
 * Generate content ideas based on business profile
 */
export async function generateContentIdeas(businessProfile, contentType, count = 5) {
  try {
    const template = contentTemplates[contentType];
    
    const prompt = `Generate ${count} specific, actionable content ideas for ${contentType} social media posts.

Business: ${businessProfile.businessName}
Industry: ${businessProfile.industry}
Products/Services: ${businessProfile.productsServices}
Target Audience: ${businessProfile.targetAudience}

Content Type: ${template.name} ${template.emoji}
Example formats: ${template.formats.slice(0, 3).join(', ')}

Requirements:
- Specific to this business and industry
- Actionable and engaging
- Varied topics
- No generic content
- Return as a numbered list
- Each idea should be 1-2 sentences

Generate ${count} unique ${contentType} content ideas:`;

    const response = await generateContentWithGemini(prompt, 'text', businessProfile);
    
    // Parse response into array
    const ideas = response
      .split('\n')
      .filter(line => line.trim() && /^\d+\./.test(line))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());
    
    return ideas.slice(0, count);
    
  } catch (error) {
    console.error(`Error generating ${contentType} ideas:`, error);
    return getDefaultIdeas(businessProfile, contentType, count);
  }
}

/**
 * Generate a complete post with content, hashtags, and CTA
 */
export async function generateCompletePost(contentIdea, contentType, businessProfile, platform = 'instagram') {
  try {
    const template = contentTemplates[contentType];
    
    // Select appropriate CTA type
    const ctaType = template.ctaTypes[Math.floor(Math.random() * template.ctaTypes.length)];
    const ctaTemplate = ctaTemplates[ctaType][Math.floor(Math.random() * ctaTemplates[ctaType].length)];
    
    // Generate post content
    const prompt = `Create an engaging ${platform} post based on this idea:

Content Idea: ${contentIdea}
Content Type: ${template.name}
Business: ${businessProfile.businessName}
Tone: ${businessProfile.tone || 'professional yet friendly'}
Platform: ${platform}

Requirements:
- Engaging opening hook
- ${platform === 'twitter' ? '280' : platform === 'linkedin' ? '1300' : '2200'} characters max
- Clear value proposition
- Natural, conversational tone
- Relevant emojis (2-4)
- ${platform}-appropriate style
- No hashtags (we'll add separately)
- End with engagement prompt

Write the post:`;

    const postContent = await generateContentWithGemini(prompt, 'text', businessProfile);
    
    // Format CTA
    const cta = formatCTA(ctaTemplate, businessProfile);
    
    return {
      content: postContent.trim(),
      cta: cta,
      fullPost: `${postContent.trim()}\n\n${cta}`,
      contentType: contentType,
      contentTypeEmoji: template.emoji
    };
    
  } catch (error) {
    console.error('Error generating complete post:', error);
    return {
      content: contentIdea,
      cta: formatCTA('Learn more: {link}', businessProfile),
      fullPost: contentIdea,
      contentType: contentType,
      contentTypeEmoji: contentTemplates[contentType].emoji
    };
  }
}

/**
 * Format CTA with business info
 */
function formatCTA(template, businessProfile) {
  let cta = template;
  
  if (businessProfile.website) {
    cta = cta.replace('{link}', businessProfile.website);
  }
  if (businessProfile.phone) {
    cta = cta.replace('{phone}', businessProfile.phone);
  }
  if (businessProfile.email) {
    cta = cta.replace('{email}', businessProfile.email);
  }
  cta = cta.replace('{business}', businessProfile.businessName || 'us');
  
  return cta;
}

/**
 * Get default content ideas (fallback)
 */
function getDefaultIdeas(businessProfile, contentType, count) {
  const defaults = {
    educational: [
      `Top tips for choosing the right ${businessProfile.industry} services`,
      `Common questions about ${businessProfile.productsServices}`,
      `What to look for when selecting a ${businessProfile.industry} provider`,
      `Industry insights: Latest trends in ${businessProfile.industry}`,
      `How to get the most value from ${businessProfile.productsServices}`
    ],
    promotional: [
      `Introducing our premium ${businessProfile.productsServices}`,
      `Special offer on ${businessProfile.productsServices}`,
      `Why choose ${businessProfile.businessName}`,
      `Our most popular ${businessProfile.productsServices}`,
      `Limited time offer for new customers`
    ],
    engagement: [
      `What's your favorite thing about ${businessProfile.industry}?`,
      `Comment below: ${businessProfile.productsServices} or alternatives?`,
      `This or that: Option A vs Option B?`,
      `Tag someone who needs ${businessProfile.productsServices}!`,
      `Poll: How do you feel about ${businessProfile.industry}?`
    ],
    testimonial: [
      `Customer success story with ${businessProfile.businessName}`,
      `5-star review from happy customer`,
      `Real results from our ${businessProfile.productsServices}`,
      `Why customers choose ${businessProfile.businessName}`,
      `Before and after: Customer transformation`
    ],
    behindScenes: [
      `Meet our team at ${businessProfile.businessName}`,
      `A day in the life at ${businessProfile.businessName}`,
      `Behind the scenes: How we deliver ${businessProfile.productsServices}`,
      `Our process for ensuring quality`,
      `Team spotlight: Meet the experts`
    ]
  };
  
  return (defaults[contentType] || defaults.educational).slice(0, count);
}

/**
 * Get optimal posting times based on platform and industry
 */
export function getOptimalPostingTimes(platform, industry) {
  // Best times based on platform and industry research
  const platformTimes = {
    linkedin: {
      default: ['08:00', '12:00', '17:00'], // Business hours
      days: [1, 2, 3, 4, 5] // Monday-Friday
    },
    instagram: {
      default: ['11:00', '14:00', '19:00'], // Lunch and evening
      days: [1, 2, 3, 4, 5, 6, 0] // All week
    },
    facebook: {
      default: ['13:00', '15:00', '20:00'], // Afternoon and evening
      days: [1, 2, 3, 4, 5, 6, 0] // All week
    },
    twitter: {
      default: ['09:00', '12:00', '18:00'], // Multiple times daily
      days: [1, 2, 3, 4, 5, 6, 0] // All week
    },
    tiktok: {
      default: ['12:00', '18:00', '21:00'], // Lunch, after work, evening
      days: [1, 2, 3, 4, 5, 6, 0] // All week
    }
  };
  
  return platformTimes[platform] || platformTimes.instagram;
}

export default {
  calculateContentMix,
  generateContentIdeas,
  generateCompletePost,
  getOptimalPostingTimes,
  CONTENT_MIX,
  contentTemplates
};
