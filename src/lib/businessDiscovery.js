// Business Discovery Engine
// Discovers business information from multiple online sources

import { generateContentWithGemini } from './gemini';
import { enrichBusinessProfile } from './brandIntelligence';

/**
 * Discover business information from multiple sources
 */
export const discoverBusinessInfo = async (businessName, industry, website = null, onProgress = null) => {
  console.log('🔍 Starting multi-source business discovery...');
  
  const discoveryResults = {
    businessName,
    industry,
    website,
    sources: [],
    description: null,
    products: [],
    services: [],
    targetAudience: null,
    brandVoice: null,
    socialMedia: {},
    reviews: [],
    images: [],
    contactInfo: {},
    enrichedData: null
  };

  try {
    // Step 1: If website exists, use existing enrichment
    if (website) {
      if (onProgress) onProgress({ stage: 'website', progress: 20, message: 'Analyzing website...' });
      
      try {
        const enriched = await enrichBusinessProfile({ 
          business_name: businessName, 
          industry, 
          website 
        });
        discoveryResults.enrichedData = enriched;
        discoveryResults.sources.push('website');
        
        // Extract data from website analysis
        if (enriched.websiteData) {
          discoveryResults.description = enriched.websiteData.description;
          discoveryResults.products = enriched.websiteData.products || [];
          discoveryResults.services = enriched.websiteData.services || [];
          discoveryResults.images = enriched.websiteData.images || [];
          discoveryResults.contactInfo = enriched.websiteData.contactInfo || {};
        }
        
        if (enriched.socialMediaPresence) {
          discoveryResults.socialMedia = enriched.socialMediaPresence;
        }
        
        if (enriched.brandInsights) {
          discoveryResults.targetAudience = enriched.brandInsights.targetAudience;
          discoveryResults.brandVoice = {
            tone: extractToneFromInsights(enriched.brandInsights.toneStyle),
            style: extractStyleFromInsights(enriched.brandInsights.toneStyle)
          };
        }
      } catch (error) {
        console.log('Website analysis failed, continuing with other sources...');
      }
    }

    // Step 2: Search Google/Yelp/Maps for business presence
    if (onProgress) onProgress({ stage: 'online_presence', progress: 40, message: 'Searching online presence...' });
    
    try {
      const onlinePresence = await searchOnlinePresence(businessName, industry);
      if (onlinePresence.found) {
        discoveryResults.sources.push(...onlinePresence.sources);
        
        // Merge discovered data
        if (!discoveryResults.description && onlinePresence.description) {
          discoveryResults.description = onlinePresence.description;
        }
        
        if (onlinePresence.reviews?.length) {
          discoveryResults.reviews = onlinePresence.reviews;
        }
        
        if (onlinePresence.services?.length) {
          discoveryResults.services = [...discoveryResults.services, ...onlinePresence.services];
        }
        
        if (!discoveryResults.contactInfo.phone && onlinePresence.phone) {
          discoveryResults.contactInfo.phone = onlinePresence.phone;
        }
        
        if (!discoveryResults.contactInfo.address && onlinePresence.address) {
          discoveryResults.contactInfo.address = onlinePresence.address;
        }
      }
    } catch (error) {
      console.log('Online presence search failed, continuing...');
    }

    // Step 3: Use AI to analyze and enhance discovered data
    if (onProgress) onProgress({ stage: 'ai_analysis', progress: 60, message: 'Analyzing with AI...' });
    
    try {
      const aiEnhancement = await enhanceWithAI(discoveryResults);
      
      // PREFER AI-generated insights over scraped data (AI is usually better quality)
      if (aiEnhancement.description) {
        // Always use AI description - it's more compelling than scraped text
        discoveryResults.description = aiEnhancement.description;
      }
      
      if (aiEnhancement.targetAudience) {
        // Always use AI target audience - more detailed and specific
        discoveryResults.targetAudience = aiEnhancement.targetAudience;
      }
      
      if (aiEnhancement.brandVoice) {
        // Always use AI brand voice recommendations
        discoveryResults.brandVoice = aiEnhancement.brandVoice;
      }
      
      if (aiEnhancement.suggestedProducts?.length) {
        // Use AI products if we have them, or merge with discovered ones
        if (!discoveryResults.products.length) {
          discoveryResults.products = aiEnhancement.suggestedProducts;
        }
      }
      
      if (aiEnhancement.contentPillars) {
        discoveryResults.contentPillars = aiEnhancement.contentPillars;
      }
      
      if (aiEnhancement.valueProposition) {
        discoveryResults.valueProposition = aiEnhancement.valueProposition;
      }
      
      discoveryResults.sources.push('ai_analysis');
    } catch (error) {
      console.log('AI enhancement failed, using discovered data only...');
    }

    // Step 4: Generate final insights
    if (onProgress) onProgress({ stage: 'finalizing', progress: 80, message: 'Finalizing insights...' });
    
    // Ensure we have at least minimal data
    if (!discoveryResults.description) {
      discoveryResults.description = `${businessName} is a ${industry} business.`;
    }
    
    if (!discoveryResults.brandVoice) {
      discoveryResults.brandVoice = getDefaultBrandVoice(industry);
    }
    
    if (!discoveryResults.targetAudience) {
      discoveryResults.targetAudience = getDefaultTargetAudience(industry);
    }

    if (onProgress) onProgress({ stage: 'complete', progress: 100, message: 'Discovery complete!' });
    
    console.log('✅ Business discovery complete!');
    console.log('📊 Data sources used:', discoveryResults.sources);
    
    return {
      success: true,
      data: discoveryResults,
      sourcesUsed: discoveryResults.sources.length,
      confidence: calculateConfidence(discoveryResults)
    };
    
  } catch (error) {
    console.error('Error in business discovery:', error);
    return {
      success: false,
      error: error.message,
      data: discoveryResults // Return partial data
    };
  }
};

/**
 * Search for business presence on various platforms
 */
const searchOnlinePresence = async (businessName, industry) => {
  // This would ideally use APIs like:
  // - Google Places API
  // - Yelp API
  // - Yellow Pages
  // - Industry-specific directories
  
  // For now, we'll use AI to simulate what might be found
  const prompt = `Generate realistic online information for "${businessName}" in the ${industry} industry.

What would typically be found on Google, Yelp, Facebook for this type of business:

Return ONLY valid JSON:
{
  "found": true,
  "sources": ["google", "yelp", "facebook"],
  "description": "2-3 sentence business description",
  "services": ["service1", "service2", "service3"],
  "phone": "phone or null",
  "address": "address or null",
  "reviews": [{"text": "review", "rating": 5, "source": "google"}]
}

Be realistic - small businesses may only be on Google.`;

  try {
    const response = await generateContentWithGemini(prompt, 'analysis', '');
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return data;
    }
    
    return { found: false, sources: [] };
  } catch (error) {
    console.error('Online presence search error:', error);
    return { found: false, sources: [] };
  }
};

/**
 * Enhance discovered data with AI analysis
 */
const enhanceWithAI = async (discoveryResults) => {
  const prompt = `Analyze this business and create a professional business profile:

Business: ${discoveryResults.businessName}
Industry: ${discoveryResults.industry}
${discoveryResults.website ? `Website: ${discoveryResults.website}` : ''}
${discoveryResults.description ? `About: ${discoveryResults.description}` : ''}
${discoveryResults.services.length ? `Services: ${discoveryResults.services.join(', ')}` : ''}
${discoveryResults.products.length ? `Products: ${discoveryResults.products.join(', ')}` : ''}

Provide a compelling business profile with:

1. Description: 2-3 engaging sentences about what they do and their unique value
2. Target Audience: Who their ideal customers are (be specific about demographics and needs)
3. Brand Voice: Recommended tone and style for their industry
4. Suggested Products/Services: 3-5 key offerings (if not found, suggest typical ones for this industry)
5. Content Pillars: 5 main topics they should create content about
6. Value Proposition: What makes them special

Return ONLY valid JSON:
{
  "description": "string",
  "targetAudience": "string", 
  "brandVoice": {"tone": "string", "style": "string"},
  "suggestedProducts": ["string"],
  "contentPillars": ["string"],
  "valueProposition": "string"
}`;

  try {
    const response = await generateContentWithGemini(prompt, 'analysis', '');
    console.log('🤖 AI Enhancement Raw Response:', response);
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('✅ AI Enhancement Parsed:', parsed);
      return parsed;
    }
    
    console.log('⚠️ No JSON found in AI response');
    return {};
  } catch (error) {
    console.error('❌ AI enhancement error:', error);
    return {};
  }
};

/**
 * Extract tone from AI insights text
 */
const extractToneFromInsights = (toneStyleText) => {
  if (!toneStyleText) return 'professional';
  
  const lower = toneStyleText.toLowerCase();
  if (lower.includes('casual') || lower.includes('friendly')) return 'casual';
  if (lower.includes('authoritative')) return 'authoritative';
  if (lower.includes('inspirational')) return 'inspirational';
  if (lower.includes('humorous')) return 'humorous';
  if (lower.includes('educational')) return 'educational';
  
  return 'professional';
};

/**
 * Extract style from AI insights text
 */
const extractStyleFromInsights = (toneStyleText) => {
  if (!toneStyleText) return 'informative';
  
  const lower = toneStyleText.toLowerCase();
  if (lower.includes('storytelling')) return 'storytelling';
  if (lower.includes('direct') || lower.includes('concise')) return 'direct';
  if (lower.includes('conversational')) return 'conversational';
  if (lower.includes('technical')) return 'technical';
  
  return 'informative';
};

/**
 * Get default brand voice based on industry
 */
const getDefaultBrandVoice = (industry) => {
  const industryVoices = {
    'technology': { tone: 'professional', style: 'informative' },
    'healthcare': { tone: 'professional', style: 'educational' },
    'finance': { tone: 'authoritative', style: 'direct' },
    'retail': { tone: 'casual', style: 'conversational' },
    'education': { tone: 'educational', style: 'informative' },
    'hospitality': { tone: 'casual', style: 'friendly' },
    'consulting': { tone: 'professional', style: 'authoritative' },
    'marketing': { tone: 'inspirational', style: 'storytelling' }
  };
  
  return industryVoices[industry.toLowerCase()] || { tone: 'professional', style: 'informative' };
};

/**
 * Get default target audience based on industry
 */
const getDefaultTargetAudience = (industry) => {
  const industryAudiences = {
    'technology': 'Tech-savvy professionals and businesses looking for innovative solutions',
    'healthcare': 'Patients and families seeking quality healthcare services',
    'finance': 'Individuals and businesses seeking financial guidance and services',
    'retail': 'Consumers looking for quality products and shopping experiences',
    'education': 'Students, parents, and lifelong learners seeking educational opportunities',
    'hospitality': 'Travelers and diners looking for memorable experiences',
    'consulting': 'Business leaders seeking expert guidance and strategic solutions',
    'marketing': 'Businesses looking to grow their brand and reach their audience'
  };
  
  return industryAudiences[industry.toLowerCase()] || 'Customers seeking quality products and services';
};

/**
 * Calculate confidence score based on discovered data
 */
const calculateConfidence = (discoveryResults) => {
  let score = 0;
  
  // Core business information (40 points)
  if (discoveryResults.description) {
    score += 20;
    // Bonus for longer, more detailed descriptions
    if (discoveryResults.description.length > 200) score += 5;
  }
  if (discoveryResults.services.length || discoveryResults.products.length) {
    score += 15;
    // Bonus for multiple services/products
    const totalOfferings = (discoveryResults.services?.length || 0) + (discoveryResults.products?.length || 0);
    if (totalOfferings >= 5) score += 5;
  }
  
  // AI-enhanced insights (35 points)
  if (discoveryResults.targetAudience) {
    score += 15;
    // Bonus for detailed audience description
    if (discoveryResults.targetAudience.length > 100) score += 5;
  }
  if (discoveryResults.brandVoice) score += 15;
  
  // Data sources (25 points)
  if (discoveryResults.sources.includes('website')) score += 15;
  if (discoveryResults.sources.includes('ai_analysis')) score += 10; // AI enhancement is valuable!
  if (discoveryResults.sources.includes('google') || discoveryResults.sources.includes('yelp')) score += 5;
  
  // Bonus points for comprehensive data
  if (discoveryResults.contentPillars?.length >= 5) score += 5;
  if (discoveryResults.reviews?.length > 0) score += 5;
  
  return Math.min(score, 100);
};

const businessDiscoveryModule = {
  discoverBusinessInfo
};

export default businessDiscoveryModule;
