/**
 * Advanced Prompt Engineering System for High-Quality AI Content
 * 
 * This module contains expert-level prompts that generate superior content
 * by leveraging psychological triggers, storytelling, and platform-specific best practices.
 */

// Master prompt templates based on proven copywriting frameworks
export const MASTER_PROMPTS = {
  // AIDA Framework (Attention, Interest, Desire, Action)
  aida: (topic, tone, platform) => `You are a master copywriter who has generated billions in revenue through your content.

Create a ${platform} post using the AIDA framework:
- ATTENTION: Start with a powerful hook that stops scrolling (question, shocking stat, bold statement)
- INTEREST: Share fascinating insights or relatable problems
- DESIRE: Build emotional connection and show transformation
- ACTION: Clear, compelling call-to-action

Topic: ${topic}
Tone: ${tone}

CRITICAL RULES:
✅ Use psychological triggers (FOMO, curiosity, social proof)
✅ Include specific numbers/stats when relevant
✅ Tell a micro-story or paint a vivid picture
✅ Use power words that evoke emotion
✅ Break up text with line breaks for scannability
✅ Include 3-5 strategic emojis that enhance (not clutter)
✅ End with 5-8 highly relevant hashtags

❌ NO fluff or filler words
❌ NO generic statements
❌ NO explanations about the post itself
❌ NO starting with "Check out" or "Here's"

Write the post NOW (just the post content):`,

  // PAS Framework (Problem, Agitate, Solution)
  pas: (topic, tone, platform) => `You are an elite content strategist who understands human psychology deeply.

Create a ${platform} post using the PAS framework:
- PROBLEM: Identify a painful, relatable problem your audience faces
- AGITATE: Make them feel the pain points more intensely
- SOLUTION: Present your solution as the hero

Topic: ${topic}
Tone: ${tone}

Make it:
🎯 Hyper-specific (avoid generic language)
💡 Insight-driven (share something they don't know)
🔥 Emotionally resonant (make them FEEL something)
⚡ Action-oriented (clear next step)

Format:
- Start with empathy/relatability
- Use short, punchy sentences
- Strategic emoji placement
- End with powerful CTA + hashtags

Write ONLY the post (no preamble):`,

  // Storytelling Framework
  storytelling: (topic, tone, platform) => `You are a master storyteller who captivates audiences with every word.

Create a compelling ${platform} story post:

Structure:
1. HOOK: Intriguing opening that creates curiosity
2. SETUP: Set the scene (who, what, when, where)
3. CONFLICT: The challenge or obstacle
4. RESOLUTION: How it was overcome
5. LESSON: The key takeaway + CTA

Topic: ${topic}
Tone: ${tone}

Storytelling Principles:
- Use vivid, sensory details
- Show, don't tell
- Create emotional peaks and valleys
- Make it personal and authentic
- Include dialogue or quotes if relevant
- End with wisdom + actionable insight

Remember: Stories sell, facts tell. Make them feel the journey.

Write the story post NOW:`,

  // Value-First Framework
  valueBomb: (topic, tone, platform) => `You are an expert who gives away million-dollar insights for free.

Create a ${platform} value post that makes people think "WOW, this is gold!"

Format as a VALUE BOMB:
💎 Opening hook (make them stop and pay attention)
📚 Share 3-5 actionable insights/tips (numbered or bulleted)
🚀 Each point should be specific, tactical, and immediately usable
💡 Include micro-examples or scenarios
🎁 Bonus tip that's extra valuable
🔥 CTA that invites engagement

Topic: ${topic}
Tone: ${tone}

Make each insight:
- Specific (not vague advice)
- Actionable (they can do it today)
- Valuable (worth paying for)
- Easy to understand

Use this proven structure:
"[Attention-grabbing statement]

Here's what I've learned after [credibility]:

1. [Insight + why it matters]
2. [Insight + micro-example]
3. [Insight + result]

Bonus: [Game-changing tip]

[Engaging question or CTA]"

Write it NOW:`,

  // Social Proof Framework
  socialProof: (topic, tone, platform) => `You are a conversion optimization expert who knows social proof sells.

Create a ${platform} post leveraging social proof:

Topic: ${topic}
Tone: ${tone}

Include elements like:
📊 Impressive numbers/results
⭐ Testimonials or success stories
👥 Community size or popularity
🏆 Awards, recognition, or credentials
📈 Growth metrics or trends
🔥 Trending indicators

Structure:
- Hook with social proof element
- Elaborate on the result/impact
- Share what made it possible
- Invite others to join/experience
- Add trust-building details
- Strong CTA + relevant hashtags

Make it credible, specific, and aspirational.

Write the post:`,

  // Curiosity Gap Framework
  curiosityGap: (topic, tone, platform) => `You are a master at creating irresistible curiosity that compels clicks.

Create a ${platform} post that opens a curiosity gap:

Topic: ${topic}
Tone: ${tone}

Curiosity Techniques:
🎣 Tease without revealing (but don't clickbait)
❓ Ask thought-provoking questions
🤔 Challenge assumptions or common beliefs
💡 Promise a surprising insight
🔓 "The secret is..." or "What they don't tell you..."
⚡ "Everyone does X, but here's what works..."

Structure:
1. Curiosity-inducing hook
2. Build anticipation
3. Deliver on the promise (don't disappoint!)
4. Actionable takeaway
5. CTA that encourages interaction

Balance: Intriguing + Valuable (not just mysterious)

Write it NOW:`,
};

// Platform-specific optimization rules
export const PLATFORM_RULES = {
  twitter: {
    maxLength: 280,
    style: 'concise, punchy, conversational',
    hashtags: '2-3 max',
    emojis: 'minimal, strategic',
    format: 'thread-friendly if needed'
  },
  linkedin: {
    maxLength: 3000,
    style: 'professional but personable, thought leadership',
    hashtags: '3-5 relevant',
    emojis: 'professional, subtle',
    format: 'value-driven, story-based, with line breaks'
  },
  instagram: {
    maxLength: 2200,
    style: 'visual, lifestyle, authentic',
    hashtags: '8-15 strategic',
    emojis: 'generous but tasteful',
    format: 'caption should complement image'
  },
  facebook: {
    maxLength: 63206,
    style: 'conversational, community-focused',
    hashtags: '3-5 max',
    emojis: 'moderate, friendly',
    format: 'engaging, discussion-provoking'
  },
  tiktok: {
    maxLength: 2200,
    style: 'trendy, authentic, entertaining',
    hashtags: '3-5 trending + niche',
    emojis: 'fun, expressive',
    format: 'hook in first 3 words'
  }
};

// Tone-specific voice guidelines
export const TONE_VOICES = {
  professional: {
    language: 'polished, credible, expert-level',
    avoid: 'slang, excessive emojis, casual abbreviations',
    use: 'data, insights, industry terminology'
  },
  casual: {
    language: 'conversational, friendly, approachable',
    avoid: 'jargon, overly formal language',
    use: 'contractions, relatable examples, humor'
  },
  enthusiastic: {
    language: 'energetic, exciting, motivational',
    avoid: 'negativity, dull language',
    use: 'power words, exclamation (sparingly), action verbs'
  },
  educational: {
    language: 'clear, informative, structured',
    avoid: 'assuming knowledge, being condescending',
    use: 'examples, analogies, step-by-step breakdowns'
  },
  humorous: {
    language: 'witty, playful, entertaining',
    avoid: 'offensive jokes, forced humor',
    use: 'wordplay, observational humor, relatability'
  },
  inspirational: {
    language: 'uplifting, empowering, visionary',
    avoid: 'toxic positivity, vague platitudes',
    use: 'personal stories, transformation, hope'
  }
};

// Enhanced content generation with framework selection
export const generateAdvancedPrompt = (params) => {
  const {
    topic,
    tone = 'professional',
    platform = 'general',
    framework = 'aida', // default framework
    businessContext = '',
    targetAudience = '',
    goal = 'engagement'
  } = params;

  // Select the appropriate framework
  const frameworkPrompt = MASTER_PROMPTS[framework] || MASTER_PROMPTS.aida;
  
  // Build the base prompt
  let basePrompt = frameworkPrompt(topic, tone, platform);
  
  // Add platform-specific rules
  if (PLATFORM_RULES[platform]) {
    const rules = PLATFORM_RULES[platform];
    basePrompt += `\n\nPLATFORM-SPECIFIC RULES FOR ${platform.toUpperCase()}:
- Style: ${rules.style}
- Max length: ${rules.maxLength} characters
- Hashtags: ${rules.hashtags}
- Emojis: ${rules.emojis}
- Format: ${rules.format}`;
  }
  
  // Add tone voice guidelines
  if (TONE_VOICES[tone]) {
    const voice = TONE_VOICES[tone];
    basePrompt += `\n\nTONE GUIDELINES FOR ${tone.toUpperCase()}:
- Language style: ${voice.language}
- Avoid: ${voice.avoid}
- Use: ${voice.use}`;
  }
  
  // Add business context if provided
  if (businessContext) {
    basePrompt += `\n\nBUSINESS CONTEXT:
${businessContext}
Use this to personalize the content and make it brand-specific.`;
  }
  
  // Add target audience if provided
  if (targetAudience) {
    basePrompt += `\n\nTARGET AUDIENCE:
${targetAudience}
Speak directly to their pain points, desires, and language.`;
  }
  
  // Add goal-specific optimization
  const goalOptimization = {
    engagement: 'Optimize for comments, shares, and saves. End with a question or poll.',
    conversion: 'Optimize for clicks and actions. Include clear CTA and urgency.',
    awareness: 'Optimize for reach and impressions. Make it shareable and relatable.',
    education: 'Optimize for value and credibility. Make it comprehensive yet digestible.',
    viral: 'Optimize for shareability. Make it surprising, emotional, or useful.'
  };
  
  if (goalOptimization[goal]) {
    basePrompt += `\n\nGOAL: ${goalOptimization[goal]}`;
  }
  
  return basePrompt;
};

// Quick prompt selector based on content type
export const selectBestFramework = (contentType) => {
  const frameworkMap = {
    'product_launch': 'aida',
    'problem_solution': 'pas',
    'case_study': 'storytelling',
    'tips_advice': 'valueBomb',
    'testimonial': 'socialProof',
    'teaser': 'curiosityGap',
    'announcement': 'aida',
    'educational': 'valueBomb',
    'promotional': 'aida',
    'thought_leadership': 'storytelling'
  };
  
  return frameworkMap[contentType] || 'aida';
};

// Power words database for high-performing content
export const POWER_WORDS = {
  curiosity: ['secret', 'hidden', 'revealed', 'truth', 'discover', 'unlock'],
  urgency: ['now', 'today', 'limited', 'ending', 'hurry', 'don\'t miss'],
  value: ['free', 'exclusive', 'proven', 'guaranteed', 'results', 'transform'],
  emotion: ['amazing', 'incredible', 'stunning', 'breakthrough', 'revolutionary'],
  trust: ['verified', 'tested', 'authentic', 'honest', 'transparent', 'real']
};

export default {
  generateAdvancedPrompt,
  selectBestFramework,
  MASTER_PROMPTS,
  PLATFORM_RULES,
  TONE_VOICES,
  POWER_WORDS
};
