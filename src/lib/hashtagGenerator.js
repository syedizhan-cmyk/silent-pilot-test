// Smart Hashtag Generator
// Generates relevant, trending hashtags for social media posts

import { generateContentWithGemini } from './gemini';

// Industry-specific hashtag database
const industryHashtags = {
  'automotive': ['#Cars', '#Auto', '#Automotive', '#Vehicle', '#CarLife', '#CarLovers', '#AutoLife', '#Vehicles', '#CarCommunity', '#AutoIndustry'],
  'motorcycles': ['#Motorcycle', '#Bike', '#BikeLife', '#Motorcycles', '#Rider', '#Moto', '#MotorcycleLove', '#RideOrDie', '#TwoWheels', '#MotorcycleLife'],
  'real estate': ['#RealEstate', '#Property', '#Homes', '#HomeForSale', '#RealEstateAgent', '#HouseHunting', '#PropertyForSale', '#RealEstateLife', '#DreamHome', '#RealEstateInvesting'],
  'technology': ['#Tech', '#Technology', '#Innovation', '#Digital', '#TechNews', '#TechLife', '#Software', '#IT', '#TechTrends', '#TechCommunity'],
  'fitness': ['#Fitness', '#Workout', '#FitnessMotivation', '#Gym', '#FitnessJourney', '#Health', '#Exercise', '#FitLife', '#Training', '#FitnessGoals'],
  'food': ['#Food', '#Foodie', '#FoodPorn', '#FoodLover', '#InstaFood', '#FoodPhotography', '#Delicious', '#Yummy', '#FoodBlogger', '#FoodGram'],
  'fashion': ['#Fashion', '#Style', '#OOTD', '#FashionBlogger', '#Fashionista', '#FashionStyle', '#InstaFashion', '#Outfit', '#Trend', '#FashionLover'],
  'beauty': ['#Beauty', '#Makeup', '#Skincare', '#BeautyBlogger', '#BeautyTips', '#MakeupLover', '#BeautyCommunity', '#SkincareRoutine', '#BeautyAddict', '#MakeupArtist'],
  'travel': ['#Travel', '#TravelGram', '#Wanderlust', '#Traveling', '#TravelPhotography', '#TravelBlogger', '#Adventure', '#Explore', '#TravelTheWorld', '#TravelLife'],
  'marketing': ['#Marketing', '#DigitalMarketing', '#SocialMedia', '#ContentMarketing', '#MarketingTips', '#Branding', '#SocialMediaMarketing', '#MarketingStrategy', '#Business', '#Entrepreneur'],
  'default': ['#Business', '#Success', '#Growth', '#Innovation', '#Professional', '#Quality', '#Service', '#Excellence', '#Local', '#Community']
};

// Platform-specific hashtag limits and strategies
const platformStrategies = {
  instagram: { max: 30, recommended: 20, style: 'trending' },
  twitter: { max: 2, recommended: 2, style: 'concise' },
  linkedin: { max: 5, recommended: 3, style: 'professional' },
  facebook: { max: 3, recommended: 2, style: 'casual' },
  tiktok: { max: 5, recommended: 4, style: 'trending' }
};

/**
 * Generate relevant hashtags for a post
 * @param {string} content - The post content
 * @param {string} industry - User's industry
 * @param {string} platform - Target platform
 * @param {object} businessContext - Business profile info
 * @returns {Promise<string[]>} Array of hashtags
 */
export async function generateHashtags(content, industry = 'default', platform = 'instagram', businessContext = {}) {
  try {
    const strategy = platformStrategies[platform] || platformStrategies.instagram;
    
    // Get base industry hashtags
    const baseHashtags = industryHashtags[industry.toLowerCase()] || industryHashtags.default;
    
    // Extract keywords from content
    const keywords = extractKeywords(content);
    
    // Generate trending/relevant hashtags using AI
    let aiHashtags = [];
    try {
      const prompt = `Generate ${strategy.recommended} relevant, trending hashtags for this social media post.

Post: ${content}
Industry: ${industry}
Platform: ${platform}
Business: ${businessContext.businessName || 'N/A'}

Requirements:
- Return only hashtags (with # symbol)
- Mix popular and niche hashtags
- Relevant to post content and industry
- ${strategy.style} style appropriate for ${platform}
- Separate with spaces
- No explanations

Example format: #Hashtag1 #Hashtag2 #Hashtag3`;

      const response = await generateContentWithGemini(prompt, 'text', businessContext);
      aiHashtags = response.match(/#\w+/g) || [];
      aiHashtags = aiHashtags.map(tag => tag.replace('#', ''));
    } catch (error) {
      console.log('AI hashtag generation failed, using fallback');
    }
    
    // Combine all sources
    let allHashtags = [
      ...aiHashtags,
      ...baseHashtags.map(h => h.replace('#', '')),
      ...keywords.map(k => capitalizeHashtag(k))
    ];
    
    // Remove duplicates (case-insensitive)
    allHashtags = [...new Set(allHashtags.map(h => h.toLowerCase()))];
    
    // Add location-based hashtags if available
    if (businessContext.city) {
      allHashtags.push(businessContext.city.replace(/\s+/g, ''));
    }
    if (businessContext.state) {
      allHashtags.push(businessContext.state.replace(/\s+/g, ''));
    }
    
    // Limit to platform maximum
    allHashtags = allHashtags.slice(0, strategy.recommended);
    
    // Add # symbol back
    return allHashtags.map(tag => '#' + tag);
    
  } catch (error) {
    console.error('Error generating hashtags:', error);
    // Fallback to basic industry hashtags
    const fallback = industryHashtags[industry.toLowerCase()] || industryHashtags.default;
    return fallback.slice(0, 5);
  }
}

/**
 * Extract keywords from content
 */
function extractKeywords(content) {
  // Remove common words
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'from'];
  
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 4 && !stopWords.includes(word));
  
  // Get top 5 most relevant words
  return words.slice(0, 5);
}

/**
 * Capitalize hashtag properly
 */
function capitalizeHashtag(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Format hashtags for display
 */
export function formatHashtags(hashtags, platform = 'instagram') {
  if (!hashtags || hashtags.length === 0) return '';
  
  const strategy = platformStrategies[platform] || platformStrategies.instagram;
  const limited = hashtags.slice(0, strategy.max);
  
  // Different formatting per platform
  switch (platform) {
    case 'instagram':
    case 'tiktok':
      return '\n\n' + limited.join(' ');
    case 'twitter':
      return ' ' + limited.join(' ');
    case 'linkedin':
    case 'facebook':
      return '\n\n' + limited.join(' ');
    default:
      return '\n\n' + limited.join(' ');
  }
}

/**
 * Get trending hashtags (simulated - would integrate with real API)
 */
export async function getTrendingHashtags(industry, limit = 10) {
  // In production, this would call Twitter API, Instagram API, etc.
  // For now, return curated trending tags
  
  const trending = {
    'automotive': ['#CarGoals', '#AutoShow', '#CarMod', '#AutoDetailing', '#CarPassion'],
    'motorcycles': ['#MotorcycleMonday', '#BikerLife', '#MotorcycleAdventure', '#RiderCommunity', '#MotorcycleGram'],
    'default': ['#MondayMotivation', '#ThrowbackThursday', '#FridayFeeling', '#WeekendVibes', '#MotivationMonday']
  };
  
  return (trending[industry] || trending.default).slice(0, limit);
}

export default {
  generateHashtags,
  formatHashtags,
  getTrendingHashtags
};
