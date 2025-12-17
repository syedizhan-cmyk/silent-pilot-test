// Brand Intelligence & Web Crawling Service
// Discovers and analyzes brand presence across the web

import { generateContentWithGemini } from './gemini';

/**
 * Extract and enrich business information from various sources
 */
export const enrichBusinessProfile = async (businessProfile) => {
  console.log('🔍 Starting brand intelligence gathering...');
  
  const enrichedData = {
    websiteData: null,
    socialMediaPresence: null,
    brandInsights: null,
    contentThemes: null,
    competitorInsights: null
  };

  try {
    // 1. Analyze website if provided
    if (businessProfile.website) {
      console.log('📊 Analyzing website...');
      enrichedData.websiteData = await analyzeWebsite(businessProfile.website);
    }

    // 2. Discover social media presence
    console.log('🔎 Discovering social media presence...');
    enrichedData.socialMediaPresence = await discoverSocialMedia(businessProfile);

    // 3. Generate brand insights using AI
    console.log('🧠 Generating brand insights...');
    enrichedData.brandInsights = await generateBrandInsights(businessProfile, enrichedData);

    // 4. Extract content themes
    console.log('📝 Extracting content themes...');
    enrichedData.contentThemes = await extractContentThemes(businessProfile, enrichedData);

    console.log('✅ Brand intelligence gathering complete!');
    return enrichedData;
  } catch (error) {
    console.error('Error enriching business profile:', error);
    return enrichedData; // Return partial data
  }
};

/**
 * Analyze website content and extract key information
 */
const analyzeWebsite = async (websiteUrl) => {
  try {
    // Clean and validate URL
    const url = cleanUrl(websiteUrl);
    
    // Call our edge function to scrape the website
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/scrape-website`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('Failed to scrape website');
    }

    const data = await response.json();
    
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords || [],
      content: data.content,
      images: data.images || [],
      about: data.about,
      services: data.services || [],
      products: data.products || [],
      contactInfo: data.contactInfo,
      socialLinks: data.socialLinks || [],
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Website analysis error:', error);
    return null;
  }
};

/**
 * Discover social media presence based on business info
 */
const discoverSocialMedia = async (businessProfile) => {
  const socialPlatforms = {
    linkedin: null,
    twitter: null,
    facebook: null,
    instagram: null,
    youtube: null,
    tiktok: null
  };

  // If website data contains social links, use those
  // Otherwise, construct likely social media URLs
  const businessName = businessProfile.business_name;
  const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Try to find social media through our edge function
  try {
    const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/discover-social-media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ 
        businessName,
        website: businessProfile.website 
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.socialMedia;
    }
  } catch (error) {
    console.log('Social media discovery via API failed, using fallback');
  }

  // Fallback: construct likely URLs
  return {
    ...socialPlatforms,
    suggestions: {
      linkedin: `https://linkedin.com/company/${cleanName}`,
      twitter: `https://twitter.com/${cleanName}`,
      facebook: `https://facebook.com/${cleanName}`,
      instagram: `https://instagram.com/${cleanName}`
    }
  };
};

/**
 * Generate comprehensive brand insights using AI
 */
const generateBrandInsights = async (businessProfile, enrichedData) => {
  const prompt = `Analyze this business and provide comprehensive brand insights:

Business Name: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
${businessProfile.website ? `Website: ${businessProfile.website}` : ''}
${enrichedData.websiteData ? `
Website Title: ${enrichedData.websiteData.title}
Website Description: ${enrichedData.websiteData.description}
Key Services/Products: ${enrichedData.websiteData.services?.join(', ') || enrichedData.websiteData.products?.join(', ')}
` : ''}

Based on this information, provide:
1. **Brand Personality**: Describe the brand's personality and voice in 2-3 sentences
2. **Key Differentiators**: What makes this business unique (3-5 points)
3. **Content Pillars**: 5-7 main themes this business should talk about
4. **Target Audience Insights**: Who they serve and what they care about
5. **Tone & Style**: How they should communicate (professional, casual, technical, etc.)
6. **Value Propositions**: Core benefits they offer (3-5 points)
7. **Content Opportunities**: Specific content ideas unique to this business (10 ideas)

Format as structured JSON with these keys: personality, differentiators, contentPillars, targetAudience, toneStyle, valuePropositions, contentOpportunities`;

  try {
    const insights = await generateContentWithGemini(prompt, 'analysis', '');
    return parseAIInsights(insights);
  } catch (error) {
    console.error('Error generating brand insights:', error);
    return generateFallbackInsights(businessProfile);
  }
};

/**
 * Parse AI-generated insights into structured data
 */
const parseAIInsights = (insightsText) => {
  try {
    // Try to extract JSON if present
    const jsonMatch = insightsText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: parse as text sections
    const sections = {};
    const lines = insightsText.split('\n');
    let currentSection = '';
    let currentContent = [];

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.includes('**') || line.includes('##')) {
        if (currentSection && currentContent.length) {
          sections[currentSection] = currentContent.join('\n');
        }
        currentSection = line.replace(/[*#:]/g, '').trim().toLowerCase().replace(/\s+/g, '_');
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });

    if (currentSection && currentContent.length) {
      sections[currentSection] = currentContent.join('\n');
    }

    return sections;
  } catch (error) {
    console.error('Error parsing insights:', error);
    return { raw: insightsText };
  }
};

/**
 * Generate fallback insights if AI fails
 */
const generateFallbackInsights = (businessProfile) => {
  return {
    personality: `${businessProfile.business_name} is a ${businessProfile.brand_voice?.tone || 'professional'} ${businessProfile.industry} business focused on delivering value to their customers.`,
    differentiators: ['Quality service', 'Customer focus', 'Industry expertise'],
    contentPillars: ['Industry insights', 'Product updates', 'Customer success', 'Tips & tricks', 'Company culture'],
    targetAudience: businessProfile.target_audience?.demographics || 'Business professionals',
    toneStyle: businessProfile.brand_voice?.tone || 'Professional and informative',
    valuePropositions: ['Reliable service', 'Expert knowledge', 'Customer satisfaction'],
    contentOpportunities: []
  };
};

/**
 * Extract content themes from business data
 */
const extractContentThemes = async (businessProfile, enrichedData) => {
  const themes = [];

  // From business profile
  if (businessProfile.products_services) {
    businessProfile.products_services.forEach(item => {
      themes.push({
        type: 'product',
        name: item.name,
        description: item.description,
        keywords: extractKeywords(item.name + ' ' + item.description)
      });
    });
  }

  // From website content
  if (enrichedData.websiteData) {
    const keywords = enrichedData.websiteData.keywords || [];
    keywords.forEach(keyword => {
      if (!themes.some(t => t.name === keyword)) {
        themes.push({
          type: 'keyword',
          name: keyword,
          source: 'website'
        });
      }
    });
  }

  // From brand insights
  if (enrichedData.brandInsights?.contentPillars) {
    const pillars = Array.isArray(enrichedData.brandInsights.contentPillars) 
      ? enrichedData.brandInsights.contentPillars 
      : enrichedData.brandInsights.contentPillars.split('\n').map(p => p.replace(/^[•\-\d.]\s*/, '').trim());
    
    pillars.forEach(pillar => {
      if (pillar && !themes.some(t => t.name === pillar)) {
        themes.push({
          type: 'pillar',
          name: pillar,
          source: 'brand_insights'
        });
      }
    });
  }

  return themes;
};

/**
 * Extract keywords from text
 */
const extractKeywords = (text) => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 5);
};

/**
 * Clean and validate URL
 */
const cleanUrl = (url) => {
  if (!url) return '';
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove trailing slash
  return url.replace(/\/$/, '');
};

/**
 * Build comprehensive business context for content generation
 */
export const buildEnhancedBusinessContext = (businessProfile, enrichedData) => {
  let context = `# Business Profile
Name: ${businessProfile.business_name}
Industry: ${businessProfile.industry}
Description: ${businessProfile.description}
`;

  if (businessProfile.website) {
    context += `Website: ${businessProfile.website}\n`;
  }

  if (businessProfile.products_services?.length) {
    context += `\n## Products & Services\n`;
    businessProfile.products_services.forEach(item => {
      context += `- ${item.name}: ${item.description}\n`;
    });
  }

  if (businessProfile.target_audience) {
    context += `\n## Target Audience\n`;
    context += `Demographics: ${businessProfile.target_audience.demographics}\n`;
    if (businessProfile.target_audience.pain_points?.length) {
      context += `Pain Points: ${businessProfile.target_audience.pain_points.join(', ')}\n`;
    }
  }

  if (businessProfile.brand_voice) {
    context += `\n## Brand Voice\n`;
    context += `Tone: ${businessProfile.brand_voice.tone}\n`;
    context += `Style: ${businessProfile.brand_voice.style}\n`;
  }

  if (businessProfile.brand_values?.length) {
    context += `\nBrand Values: ${businessProfile.brand_values.join(', ')}\n`;
  }

  // Add enriched data
  if (enrichedData?.websiteData) {
    context += `\n## Website Insights\n`;
    context += `Description: ${enrichedData.websiteData.description}\n`;
    if (enrichedData.websiteData.services?.length) {
      context += `Services Found: ${enrichedData.websiteData.services.join(', ')}\n`;
    }
    if (enrichedData.websiteData.keywords?.length) {
      context += `Key Topics: ${enrichedData.websiteData.keywords.join(', ')}\n`;
    }
  }

  if (enrichedData?.brandInsights) {
    context += `\n## Brand Intelligence\n`;
    if (enrichedData.brandInsights.personality) {
      context += `Personality: ${enrichedData.brandInsights.personality}\n`;
    }
    if (enrichedData.brandInsights.differentiators) {
      const diff = Array.isArray(enrichedData.brandInsights.differentiators) 
        ? enrichedData.brandInsights.differentiators.join(', ')
        : enrichedData.brandInsights.differentiators;
      context += `Differentiators: ${diff}\n`;
    }
    if (enrichedData.brandInsights.valuePropositions) {
      const vp = Array.isArray(enrichedData.brandInsights.valuePropositions)
        ? enrichedData.brandInsights.valuePropositions.join(', ')
        : enrichedData.brandInsights.valuePropositions;
      context += `Value Propositions: ${vp}\n`;
    }
  }

  if (enrichedData?.contentThemes?.length) {
    context += `\n## Content Themes\n`;
    enrichedData.contentThemes.slice(0, 10).forEach(theme => {
      context += `- ${theme.name}${theme.description ? ': ' + theme.description : ''}\n`;
    });
  }

  return context;
};

/**
 * Get content ideas based on enriched brand intelligence
 */
export const getEnrichedContentIdeas = (enrichedData, businessProfile) => {
  const ideas = [];

  // From brand insights content opportunities
  if (enrichedData?.brandInsights?.contentOpportunities) {
    const opportunities = Array.isArray(enrichedData.brandInsights.contentOpportunities)
      ? enrichedData.brandInsights.contentOpportunities
      : enrichedData.brandInsights.contentOpportunities.split('\n').filter(o => o.trim());
    
    opportunities.forEach(opp => {
      ideas.push({
        topic: opp.replace(/^[•\-\d.]\s*/, '').trim(),
        source: 'brand_insights',
        relevance: 'high'
      });
    });
  }

  // From content themes
  if (enrichedData?.contentThemes) {
    enrichedData.contentThemes.forEach(theme => {
      ideas.push({
        topic: `Share insights about ${theme.name}`,
        source: 'content_themes',
        relevance: 'medium',
        keywords: theme.keywords
      });
    });
  }

  // From products/services
  if (businessProfile.products_services?.length) {
    businessProfile.products_services.forEach(item => {
      ideas.push({
        topic: `Highlight ${item.name} and its benefits`,
        source: 'products',
        relevance: 'high',
        details: item.description
      });
    });
  }

  return ideas;
};
