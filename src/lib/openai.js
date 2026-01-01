import OpenAI from 'openai';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. Please add it to .env file');
}

// Initialize OpenAI only if API key is valid
export const openai = apiKey && apiKey !== 'placeholder-key' ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Only for development
}) : null;

// Generate content using OpenAI
export const generateContent = async (prompt, platform = 'general') => {
  try {
    // Debug logging
    console.log('API Key from env:', apiKey ? 'Found' : 'Not found');
    console.log('API Key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey || apiKey === 'placeholder-key') {
      throw new Error('OpenAI API key is missing or invalid. Please check your .env file.');
    }
    
    const systemPrompt = `You are a professional social media content creator. Generate engaging content for ${platform}.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error Details:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code
    });
    
    // More specific error messages
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your API key in the .env file.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your usage limits.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};

// Optimize content for SEO
export const optimizeForSEO = async (content, keywords) => {
  try {
    const prompt = `Optimize this content for SEO with these keywords: ${keywords.join(', ')}\n\nContent: ${content}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an SEO expert. Optimize content for search engines while maintaining readability." },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('SEO Optimization Error:', error);
    throw error;
  }
};
