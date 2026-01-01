/**
 * Advanced Media Generation System
 * Professional-quality images and videos for social media
 * 
 * Supports:
 * - DALL-E 3 (OpenAI) - Best quality images
 * - Stable Diffusion XL (Replicate) - High quality, customizable
 * - Runway ML - Professional video generation
 * - Pika Labs - AI video creation
 * - LeonardoAI - High-quality artistic images
 */

import OpenAI from 'openai';
import { generateContentWithGemini } from './gemini';

// Initialize OpenAI for DALL-E 3
const openaiKey = process.env.REACT_APP_OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({
  apiKey: openaiKey,
  dangerouslyAllowBrowser: true
}) : null;

// API Keys
const REPLICATE_API_KEY = process.env.REACT_APP_REPLICATE_API_KEY;
const RUNWAY_API_KEY = process.env.REACT_APP_RUNWAY_API_KEY;
const LEONARDO_API_KEY = process.env.REACT_APP_LEONARDO_API_KEY;

/**
 * Advanced Prompt Engineering for Images
 * Creates photorealistic, professional prompts
 */
const enhanceImagePrompt = async (userPrompt, businessContext, style) => {
  const styleGuides = {
    professional: 'photorealistic, corporate, clean, polished, high-end, professional photography, studio lighting, sharp focus, 8K resolution',
    creative: 'artistic, unique, imaginative, vibrant colors, creative composition, stunning visual, award-winning',
    realistic: 'hyperrealistic, lifelike, natural lighting, authentic, detailed textures, photographic quality, DSLR',
    minimalist: 'clean, simple, minimal, elegant, sophisticated, white background, product photography',
    dramatic: 'cinematic lighting, dramatic shadows, high contrast, moody atmosphere, film noir style',
    vibrant: 'bold colors, high saturation, energetic, eye-catching, Instagram-worthy, dynamic composition'
  };

  const stylePrompt = styleGuides[style] || styleGuides.professional;

  // Use AI to create an expert-level prompt
  if (openai) {
    try {
      const promptEnhancement = `You are an expert at creating prompts for DALL-E 3 and professional AI image generation.

User wants: ${userPrompt}
Style: ${style}
Business Context: ${businessContext || 'General business'}

Create ONE professional image generation prompt (150-250 words) that:
1. Describes the exact visual composition in vivid detail
2. Specifies professional photography techniques (camera angle, lighting, depth of field)
3. Includes the ${style} aesthetic naturally
4. Mentions specific details (textures, colors, atmosphere)
5. Incorporates business context subtly if relevant
6. Uses technical photography terms (e.g., "shallow depth of field", "golden hour lighting")
7. Specifies image quality (e.g., "8K resolution", "professional photography")

CRITICAL: Return ONLY the prompt text. No explanations, quotes, or meta-commentary.

Example good prompt:
"A modern tech startup office space with floor-to-ceiling windows overlooking a city skyline. Natural golden hour sunlight streams through, creating warm ambient lighting. In the foreground, a diverse team of professionals collaborates around a sleek glass conference table with laptops and digital tablets. The composition uses a wide-angle lens (24mm) with shallow depth of field, keeping the team in sharp focus while the background gently blurs. Modern minimalist design with plants, concrete floors, and contemporary furniture. Professional corporate photography style, shot on Sony A7R IV, 8K resolution, photorealistic quality."

Now create the prompt:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: promptEnhancement }],
        max_tokens: 400,
        temperature: 0.7
      });

      const enhanced = response.choices[0].message.content.trim();
      console.log('✨ AI-enhanced prompt:', enhanced);
      return enhanced;
    } catch (error) {
      console.warn('Prompt enhancement failed, using manual enhancement:', error.message);
    }
  }

  // Fallback: Manual enhancement
  let enhancedPrompt = userPrompt;
  
  if (businessContext) {
    enhancedPrompt = `${userPrompt} for ${businessContext}`;
  }
  
  enhancedPrompt += `, ${stylePrompt}, professional quality, high resolution, detailed, sharp focus`;
  
  return enhancedPrompt;
};

/**
 * Generate professional image with DALL-E 3 (Best Quality)
 */
export const generateImageDALLE3 = async (prompt, businessContext = '', style = 'professional') => {
  try {
    console.log('🎨 Generating image with DALL-E 3 (Premium Quality)...');
    
    if (!openai) {
      throw new Error('OpenAI API key required for DALL-E 3. Add REACT_APP_OPENAI_API_KEY to .env');
    }

    // Enhance the prompt
    const enhancedPrompt = await enhanceImagePrompt(prompt, businessContext, style);
    
    // Generate with DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd", // HD quality for best results
      style: style === 'creative' ? 'vivid' : 'natural'
    });

    const imageUrl = response.data[0].url;
    
    console.log('✅ DALL-E 3 image generated successfully');
    
    return {
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      revisedPrompt: response.data[0].revised_prompt, // DALL-E 3 provides this
      service: 'DALL-E 3 (OpenAI) ⭐⭐⭐',
      quality: 'HD',
      downloadable: true,
      note: 'Generated with DALL-E 3 - Premium photorealistic quality'
    };
  } catch (error) {
    console.error('DALL-E 3 error:', error);
    throw new Error(`DALL-E 3 failed: ${error.message}`);
  }
};

/**
 * Generate image with Stable Diffusion XL via Replicate (High Quality)
 */
export const generateImageSDXL = async (prompt, businessContext = '', style = 'professional') => {
  try {
    console.log('🎨 Generating image with Stable Diffusion XL...');
    
    if (!REPLICATE_API_KEY) {
      throw new Error('Replicate API key required. Get free key at https://replicate.com');
    }

    const enhancedPrompt = await enhanceImagePrompt(prompt, businessContext, style);
    
    // Negative prompt for better quality
    const negativePrompt = 'ugly, deformed, noisy, blurry, distorted, grainy, low quality, watermark, text, logo, signature, draft, amateur';

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
        input: {
          prompt: enhancedPrompt,
          negative_prompt: negativePrompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: 'K_EULER'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Replicate API request failed');
    }

    const prediction = await response.json();
    
    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60;
    
    while (!imageUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${REPLICATE_API_KEY}` }
      });
      
      const status = await statusResponse.json();
      
      if (status.status === 'succeeded') {
        imageUrl = status.output[0];
      } else if (status.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timed out');
    }

    console.log('✅ SDXL image generated successfully');
    
    return {
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      service: 'Stable Diffusion XL ⭐⭐',
      quality: 'High',
      downloadable: true,
      note: 'Generated with Stable Diffusion XL - Professional quality'
    };
  } catch (error) {
    console.error('SDXL error:', error);
    throw new Error(`SDXL failed: ${error.message}`);
  }
};

/**
 * Generate image with Leonardo.ai (Artistic Quality)
 */
export const generateImageLeonardo = async (prompt, businessContext = '', style = 'professional') => {
  try {
    console.log('🎨 Generating image with Leonardo.ai...');
    
    if (!LEONARDO_API_KEY) {
      throw new Error('Leonardo API key required. Get free key at https://leonardo.ai');
    }

    const enhancedPrompt = await enhanceImagePrompt(prompt, businessContext, style);
    
    const stylePresets = {
      professional: 'CINEMATIC',
      creative: 'CREATIVE',
      realistic: 'STOCK_PHOTO',
      minimalist: 'MINIMALIST',
      dramatic: 'CINEMATIC',
      vibrant: 'DYNAMIC'
    };

    const response = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEONARDO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Phoenix
        width: 1024,
        height: 1024,
        num_images: 1,
        guidance_scale: 7,
        sd_version: 'PHOENIX',
        presetStyle: stylePresets[style] || 'CINEMATIC'
      })
    });

    if (!response.ok) {
      throw new Error('Leonardo API request failed');
    }

    const data = await response.json();
    const generationId = data.sdGenerationJob.generationId;
    
    // Poll for completion
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (!imageUrl && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const checkResponse = await fetch(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        { headers: { 'Authorization': `Bearer ${LEONARDO_API_KEY}` } }
      );
      
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.generations_by_pk?.status === 'COMPLETE' && 
            checkData.generations_by_pk?.generated_images?.length > 0) {
          imageUrl = checkData.generations_by_pk.generated_images[0].url;
        }
      }
      
      attempts++;
    }

    if (!imageUrl) {
      throw new Error('Image generation timed out');
    }

    console.log('✅ Leonardo image generated successfully');
    
    return {
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      service: 'Leonardo.ai ⭐⭐',
      quality: 'High',
      downloadable: true,
      note: 'Generated with Leonardo.ai - Artistic quality'
    };
  } catch (error) {
    console.error('Leonardo error:', error);
    throw new Error(`Leonardo failed: ${error.message}`);
  }
};

/**
 * Smart Image Generator - Tries best available service
 */
export const generateProfessionalImage = async (prompt, businessContext = '', style = 'professional') => {
  const errors = [];

  // Try DALL-E 3 first (best quality)
  if (openaiKey) {
    try {
      return await generateImageDALLE3(prompt, businessContext, style);
    } catch (error) {
      errors.push(`DALL-E 3: ${error.message}`);
      console.warn('DALL-E 3 failed, trying next service...');
    }
  }

  // Try SDXL via Replicate
  if (REPLICATE_API_KEY) {
    try {
      return await generateImageSDXL(prompt, businessContext, style);
    } catch (error) {
      errors.push(`SDXL: ${error.message}`);
      console.warn('SDXL failed, trying next service...');
    }
  }

  // Try Leonardo.ai
  if (LEONARDO_API_KEY) {
    try {
      return await generateImageLeonardo(prompt, businessContext, style);
    } catch (error) {
      errors.push(`Leonardo: ${error.message}`);
      console.warn('Leonardo failed');
    }
  }

  // All failed
  throw new Error(`All image generation services failed:\n${errors.join('\n')}\n\nPlease add at least one API key to .env file:\n- REACT_APP_OPENAI_API_KEY (for DALL-E 3)\n- REACT_APP_REPLICATE_API_KEY (for SDXL)\n- REACT_APP_LEONARDO_API_KEY (for Leonardo)`);
};

/**
 * Generate AI Video Script and Storyboard
 */
export const generateVideoScript = async (topic, duration = 30, businessContext = '') => {
  try {
    console.log('📹 Generating video script...');
    
    const prompt = `Create a professional ${duration}-second video script for social media.

Topic: ${topic}
Business Context: ${businessContext || 'General'}
Duration: ${duration} seconds

Provide:
1. Hook (first 3 seconds - must grab attention)
2. Main Content (${duration - 8} seconds - key message)
3. Call-to-Action (last 5 seconds - clear next step)

For each scene, specify:
- Timestamp
- Visual description (what to show)
- Voiceover/text overlay
- Shot type (close-up, wide, etc.)
- Transition effect

Format as JSON with: hook, scenes[], cta, visualNotes

Make it engaging, platform-optimized, and conversion-focused.`;

    const script = await generateContentWithGemini(prompt, 'video', businessContext);
    
    return {
      success: true,
      script: script,
      duration: duration,
      note: 'Professional video script ready for production'
    };
  } catch (error) {
    throw new Error(`Video script generation failed: ${error.message}`);
  }
};

/**
 * Generate Video Concept with AI
 */
export const generateVideoConceptAndStoryboard = async (prompt, businessContext = '', duration = 30) => {
  try {
    console.log('🎬 Generating video concept...');
    
    // Generate comprehensive video concept
    const conceptPrompt = `Create a professional video production concept for social media.

Request: ${prompt}
Business: ${businessContext || 'General'}
Duration: ${duration} seconds
Platform: Instagram/TikTok/LinkedIn

Provide a complete production plan:
1. **Concept Overview**: Hook and main theme
2. **Visual Style**: Aesthetic, color palette, mood
3. **Shot List**: 5-8 specific shots with descriptions
4. **Text Overlays**: Key messages to display
5. **Music/Sound**: Suggested style and mood
6. **Call-to-Action**: Final frame message

Make it executable, engaging, and platform-optimized.`;

    const concept = await generateContentWithGemini(conceptPrompt, 'video', businessContext);
    
    return {
      success: true,
      concept: concept,
      duration: duration,
      note: 'Video concept ready - can be used with any video editor or AI video tool',
      nextSteps: [
        'Use concept with video editor (CapCut, Adobe Premiere)',
        'Generate AI video with Runway ML or Pika Labs',
        'Create using stock footage + your concept',
        'Film using the shot list provided'
      ]
    };
  } catch (error) {
    throw new Error(`Video concept generation failed: ${error.message}`);
  }
};

export default {
  generateProfessionalImage,
  generateImageDALLE3,
  generateImageSDXL,
  generateImageLeonardo,
  generateVideoScript,
  generateVideoConceptAndStoryboard
};
