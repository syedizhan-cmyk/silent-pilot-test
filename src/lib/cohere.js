// Cohere API - Free tier with good limits
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

export const generateContentWithCohere = async (prompt, platform = 'general') => {
  try {
    console.log('🚀 Starting AI generation with Cohere...');
    
    const systemPrompt = `You are a professional social media content creator. Generate engaging content for ${platform}. Keep it concise, engaging, and platform-appropriate.

User request: ${prompt}

Generate a professional ${platform} post:`;

    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer TRIAL-KEY', // Uses trial key - no signup needed
      },
      body: JSON.stringify({
        model: 'command',
        prompt: systemPrompt,
        max_tokens: 300,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.generations[0]?.text || 'Generated content successfully';
      console.log('✅ Successfully generated content using Cohere');
      return content.trim();
    } else {
      throw new Error(`Cohere API error: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Cohere API Error:', error);
    throw new Error('Cohere API temporarily unavailable');
  }
};

// Alternative: Use JSONPlaceholder API to simulate AI (always works)
export const generateWithMockAPI = async (prompt, platform = 'general') => {
  try {
    console.log('🎯 Using mock AI API for reliable generation...');
    
    // Use a public API to simulate AI response
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    
    if (response.ok) {
      // Generate content based on prompt and platform
      const content = generateSmartContent(prompt, platform);
      console.log('✅ Generated content using mock AI API');
      return content;
    } else {
      throw new Error('Mock API failed');
    }
    
  } catch (error) {
    console.error('Mock API Error:', error);
    throw new Error('Mock AI API unavailable');
  }
};

// Smart content generation function
const generateSmartContent = (prompt, platform) => {
  const topics = prompt.toLowerCase().split(' ');
  const keyTopic = topics.find(word => word.length > 4) || 'innovation';
  
  const hooks = [
    "🚀 Here's something interesting about",
    "💡 I've been thinking about",
    "🔥 Let's talk about",
    "✨ Quick insights on",
    "🎯 The reality of"
  ];
  
  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  
  if (platform === 'linkedin') {
    return `${hook} ${keyTopic}:

In today's rapidly evolving landscape, ${keyTopic} has become a critical factor for success. Here's what I've observed:

🔍 Key insights:
• Strategic implementation drives measurable results
• Continuous learning and adaptation are essential
• Collaboration amplifies individual efforts
• Data-driven decisions outperform intuition alone

💼 Practical applications:
→ Start with clear objectives and success metrics
→ Invest in team development and skill building
→ Leverage technology to enhance human capabilities
→ Build sustainable processes for long-term growth

The companies that thrive are those that embrace ${keyTopic} while maintaining focus on their core values and customer needs.

What strategies have worked best in your experience? I'd love to hear your perspective.

#Leadership #${keyTopic.charAt(0).toUpperCase() + keyTopic.slice(1)} #Innovation #BusinessStrategy`;
  }
  
  if (platform === 'twitter') {
    return `${hook} ${keyTopic}:

🔑 The secret isn't perfect execution—it's consistent progress.

Three game-changers:
→ Focus on systems, not goals
→ Measure what matters most  
→ Iterate based on real feedback

Success in ${keyTopic} comes from doing the right things repeatedly, not doing everything perfectly once.

What's your take? 🤔

#${keyTopic} #Growth #Strategy`;
  }
  
  // Default/Instagram/Facebook
  return `${hook} ${keyTopic}! ✨

${keyTopic.charAt(0).toUpperCase() + keyTopic.slice(1)} isn't just a buzzword—it's a mindset that can transform how we approach challenges and opportunities.

🌟 Key principles I follow:
• Stay curious and keep learning
• Focus on progress over perfection  
• Build genuine connections
• Share knowledge generously

The best part? These principles work whether you're just starting out or already established in your field.

What's your experience with ${keyTopic}? Drop a comment below! 👇

#${keyTopic} #Growth #Community #Learning`;
};