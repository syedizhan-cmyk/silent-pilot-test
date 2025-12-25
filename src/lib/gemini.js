import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateContentWithGroq } from './groq';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Gemini API key not found. Please add it to .env file');
}

// Initialize with correct API version
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Cache which AI provider is working to avoid retrying failed ones
let workingProvider = null; // Will be 'gemini', 'groq', or 'huggingface'
let lastFailureCheck = null;
const FAILURE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Reset the working provider cache (e.g., after quota reset)
export const resetAIProviderCache = () => {
  workingProvider = null;
  lastFailureCheck = null;
  console.log('🔄 AI provider cache reset');
};

// Fallback to Hugging Face Inference API (completely free, no API key needed)
const generateWithHuggingFace = async (prompt, platform = 'general') => {
  try {
    console.log('🤗 Attempting Hugging Face Inference API (Free, no API key)...');
    
    // Simplified prompt for better results with free models
    const simplifiedPrompt = `Write a professional ${platform} social media post about: ${prompt.substring(0, 500)}`;
    
    // Using google/flan-t5-large - reliable free model
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: simplifiedPrompt,
        parameters: {
          max_length: 300,
          temperature: 0.8,
          top_p: 0.9,
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // If model is loading, wait and retry once
      if (response.status === 503) {
        console.log('⏳ Model is loading, waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const retryResponse = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputs: simplifiedPrompt,
            parameters: { max_length: 300, temperature: 0.8 },
            options: { wait_for_model: true }
          })
        });
        
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          const content = Array.isArray(retryData) ? retryData[0]?.generated_text : retryData.generated_text;
          if (content) {
            console.log('✅ Successfully generated content using Hugging Face (Free) after retry');
            return content.trim();
          }
        }
      }
      
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let content = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      content = data[0].generated_text;
    } else if (data.generated_text) {
      content = data.generated_text;
    } else {
      throw new Error('Unexpected Hugging Face response format');
    }
    
    console.log('✅ Successfully generated content using Hugging Face (Free)');
    return content.trim();
  } catch (error) {
    console.error('❌ Hugging Face Error:', error);
    throw new Error(`Hugging Face failed: ${error.message}`);
  }
};

// Generate content using Gemini with business context and 3-tier fallback (with caching)
export const generateContentWithGemini = async (prompt, platform = 'general', businessContext = '') => {
  // Build full prompt with context
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
  
  // Check if we should reset the cache
  if (lastFailureCheck && (Date.now() - lastFailureCheck > FAILURE_CACHE_DURATION)) {
    console.log('🔄 Cache expired, resetting AI provider selection...');
    workingProvider = null;
    lastFailureCheck = null;
  }
  
  // If we know which provider works, try it first
  if (workingProvider === 'groq') {
    try {
      const groqContent = await generateContentWithGroq(fullPrompt, platform);
      if (groqContent && groqContent.length > 50) {
        return groqContent;
      }
    } catch (error) {
      console.warn('⚠️ Cached provider (Groq) failed, trying all providers...');
      workingProvider = null;
    }
  } else if (workingProvider === 'huggingface') {
    try {
      const hfContent = await generateWithHuggingFace(fullPrompt, platform);
      if (hfContent && hfContent.length > 50) {
        return hfContent;
      }
    } catch (error) {
      console.warn('⚠️ Cached provider (Hugging Face) failed, trying all providers...');
      workingProvider = null;
    }
  }
  
  // TIER 1: Try Gemini (Best quality, but may have quota issues)
  if (!workingProvider || workingProvider === 'gemini') {
    try {
      console.log('🚀 TIER 1: Attempting Gemini 1.5 Flash...');
      
      if (!apiKey) {
        throw new Error('Gemini API key is missing');
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      if (text && text.length > 50) {
        console.log('✅ SUCCESS: Gemini generated content, length:', text.length);
        workingProvider = 'gemini';
        return text;
      } else {
        throw new Error('Gemini returned empty or too short response');
      }
    } catch (geminiError) {
      console.warn('⚠️ TIER 1 FAILED: Gemini error:', geminiError.message);
      lastFailureCheck = Date.now();
      
      // TIER 2: Try Groq (Fast and free with good quality)
      try {
        console.log('🚀 TIER 2: Attempting Groq (Free)...');
        const groqContent = await generateContentWithGroq(fullPrompt, platform);
        
        if (groqContent && groqContent.length > 50) {
          console.log('✅ SUCCESS: Groq generated content, length:', groqContent.length);
          workingProvider = 'groq';
          console.log('💾 Cached: Using Groq for subsequent requests');
          return groqContent;
        } else {
          throw new Error('Groq returned empty or too short response');
        }
      } catch (groqError) {
        console.warn('⚠️ TIER 2 FAILED: Groq error:', groqError.message);
        
        // TIER 3: Try Hugging Face (Completely free, no API key needed)
        try {
          console.log('🚀 TIER 3: Attempting Hugging Face Inference (Free, no API key)...');
          const hfContent = await generateWithHuggingFace(fullPrompt, platform);
          
          if (hfContent && hfContent.length > 50) {
            console.log('✅ SUCCESS: Hugging Face generated content, length:', hfContent.length);
            workingProvider = 'huggingface';
            console.log('💾 Cached: Using Hugging Face for subsequent requests');
            return hfContent;
          } else {
            throw new Error('Hugging Face returned empty or too short response');
          }
        } catch (hfError) {
          console.error('❌ ALL TIERS FAILED');
          console.error('Tier 1 (Gemini):', geminiError.message);
          console.error('Tier 2 (Groq):', groqError.message);
          console.error('Tier 3 (Hugging Face):', hfError.message);
          
          // Provide helpful error message
          throw new Error(`All AI providers failed. Please check:
1. Gemini: ${geminiError.message}
2. Groq: ${groqError.message}
3. Hugging Face: ${hfError.message}

Add at least one valid API key to your .env file:
- REACT_APP_GEMINI_API_KEY (Get free at: https://aistudio.google.com/app/apikey)
- REACT_APP_GROQ_API_KEY (Get free at: https://console.groq.com/keys)`);
        }
      }
    }
  }
};

// Optimize content for SEO using Gemini
export const optimizeForSEOWithGemini = async (content, keywords) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is missing.');
    }
    
    // Use same confirmed working model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an SEO expert. Optimize this content for search engines while maintaining readability and engagement. Include these keywords naturally: ${keywords.join(', ')}\n\nContent to optimize: ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Gemini SEO Optimization Error:', error);
    throw error;
  }
};