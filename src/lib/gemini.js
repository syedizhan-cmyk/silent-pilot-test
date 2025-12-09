import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key not found. Please add it to .env file');
}

// Initialize with correct API version
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Generate content using Gemini with business context
export const generateContentWithGemini = async (prompt, platform = 'general', businessContext = '') => {
  try {
    // Debug logging
    console.log('Gemini API Key from env:', apiKey ? 'Found' : 'Not found');
    console.log('Gemini API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
    }
    
    // Use Gemini 2.5 Flash (confirmed working)
    console.log('🚀 Using Gemini 2.5 Flash...');
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    
    // Build context-aware prompt
    let systemPrompt = `You are a professional social media content creator.

CRITICAL INSTRUCTIONS:
- Generate ONLY the final post content - NO explanations, NO meta-commentary
- DO NOT include phrases like "Here's your content", "Here is a post", "Check out this post", etc.
- DO NOT include formatting instructions or descriptions
- Start directly with the actual post content
- Make it engaging, high-quality, and platform-appropriate for ${platform}
- Include relevant emojis naturally in the text
- Add 5-8 relevant hashtags at the end`;
    
    if (businessContext) {
      systemPrompt += `\n\nBusiness Context:\n${businessContext}\n\nUse this business information to create personalized, relevant content that aligns with the brand voice, targets the right audience, and highlights the products/services appropriately.`;
    }
    
    const fullPrompt = `${systemPrompt}\n\n${prompt}\n\nWrite the post now (content only, no explanations):`;
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini response received, length:', text.length);
    return text;
  } catch (error) {
    console.error('🔥 DETAILED Gemini Error:', {
      message: error.message,
      status: error.status,
      code: error.code,
      fullError: error
    });
    
    console.log('🔍 API Key being used:', apiKey ? `${apiKey.substring(0, 20)}...` : 'MISSING');
    console.log('🔍 Error type:', typeof error);
    console.log('🔍 Error constructor:', error.constructor.name);
    
    // More specific error messages
    if (error.message.includes('API_KEY_INVALID')) {
      throw new Error('Invalid Gemini API key. Please check your API key in the .env file.');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      throw new Error('Gemini API quota exceeded. Please wait before trying again.');
    } else if (error.message.includes('BLOCKED')) {
      throw new Error('Content was blocked by safety filters. Try rephrasing your prompt.');
    } else if (error.message.includes('not found') || error.message.includes('404')) {
      throw new Error('Gemini models not accessible. Go to https://console.cloud.google.com/apis/library and enable "Generative Language API"');
    } else if (error.message.includes('403') || error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Gemini API not enabled. Enable it at https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    } else if (error.message.includes('API key not valid')) {
      throw new Error('Invalid Gemini API key. Create a new one at https://aistudio.google.com/app/apikey');
    }
    
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

// Optimize content for SEO using Gemini
export const optimizeForSEOWithGemini = async (content, keywords) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }
    
    // Use same confirmed working model
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    
    const prompt = `You are an SEO expert. Optimize this content for search engines while maintaining readability and engagement. Include these keywords naturally: ${keywords.join(', ')}\n\nContent to optimize: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Gemini SEO Optimization Error:', error);
    throw error;
  }
};