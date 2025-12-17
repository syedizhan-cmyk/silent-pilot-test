// Groq API - Free tier with high-quality models
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get API key from environment
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const generateContentWithGroq = async (prompt, platform = 'general') => {
  try {
    if (!GROQ_API_KEY || GROQ_API_KEY.trim() === '' || GROQ_API_KEY === 'your_groq_api_key_here') {
      throw new Error('Groq API key not configured');
    }
    
    console.log('🚀 Starting AI generation with Groq...');
    
    const systemMessage = `You are a professional social media content creator. Generate engaging, high-quality content for ${platform}. Keep it concise, engaging, and platform-appropriate. Include relevant emojis and hashtags.`;
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Updated to latest free model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
      throw new Error(`Groq API error: ${errorMsg}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content || content.trim().length < 50) {
      throw new Error('Groq returned empty or too short response');
    }
    
    console.log('✅ Successfully generated content using Groq');
    return content.trim();
    
  } catch (error) {
    console.error('Groq API Error:', error.message);
    throw new Error(`Groq failed: ${error.message}`);
  }
};

// Alternative: Try a different free AI API
export const generateContentWithHuggingFaceFree = async (prompt, platform = 'general') => {
  try {
    console.log('🚀 Trying free Hugging Face model...');
    
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Create a ${platform} post about: ${prompt}`,
      })
    });

    if (response.ok) {
      const data = await response.json();
      let content = data.generated_text || data[0]?.generated_text || 'Generated content';
      console.log('✅ Successfully generated content using Hugging Face');
      return content.trim();
    } else {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Hugging Face Error:', error);
    throw new Error('Hugging Face API unavailable');
  }
};