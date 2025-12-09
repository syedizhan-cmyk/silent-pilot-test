// Groq API - Free tier with high-quality models
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get API key from environment
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const generateContentWithGroq = async (prompt, platform = 'general') => {
  try {
    console.log('🚀 Starting AI generation with Groq...');
    
    const systemMessage = `You are a professional social media content creator. Generate engaging, high-quality content for ${platform}. Keep it concise, engaging, and platform-appropriate. Include relevant emojis and hashtags.`;
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Free fast model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'Generated content successfully';
      console.log('✅ Successfully generated content using Groq');
      return content.trim();
    } else {
      throw new Error(`Groq API error: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Groq API unavailable');
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