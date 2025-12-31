// AI Vision Analyzer for scanning images and videos
let openai = null;
let OpenAI = null;

const initOpenAI = () => {
  try {
    if (!OpenAI) OpenAI = require('openai').default;
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (apiKey && apiKey !== '[LOCAL_KEY_ONLY]' && apiKey.startsWith('sk-')) {
      openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  } catch (err) {
    console.warn('OpenAI not available');
  }
};

/**
 * Analyze an image using OpenAI's vision model
 * @param {string} imageUrl - URL or base64 of the image
 * @param {object} businessContext - Business profile context
 * @returns {object} - Analysis with description, keywords, mood, and content suggestions
 */
export const analyzeImage = async (imageUrl, businessContext = {}) => {
  try {
    if (!openai) initOpenAI();
    if (!openai) {
      console.warn('OpenAI API key not configured');
      return {
        description: "Image analysis not available without OpenAI API key",
        mood: "neutral",
        visual_elements: [],
        social_media_themes: ["Configure OpenAI API key in .env"]
      };
    }
    console.log('🔍 Analyzing image with AI vision...');
    
    const prompt = `Analyze this image for social media content creation.
    
Business Context:
- Business: ${businessContext.business_name || 'Unknown'}
- Industry: ${businessContext.industry || 'General'}
- Target Audience: ${businessContext.target_audience || 'General audience'}

Please provide:
1. A detailed description of what's in the image
2. The mood/emotion it conveys
3. Key visual elements and subjects
4. Suggested themes for social media posts
5. Recommended hashtags (5-8)
6. Best platforms for this type of content (LinkedIn, Twitter, Instagram, Facebook)

Format your response as JSON with these keys: description, mood, elements, themes, hashtags, platforms`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000
    });

    const analysis = response.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured text
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      // If not JSON, create structured object from text
      parsedAnalysis = {
        description: analysis.substring(0, 300),
        mood: 'professional',
        elements: [],
        themes: ['business', 'professional'],
        hashtags: ['#business', '#professional', '#success'],
        platforms: ['linkedin', 'twitter', 'facebook', 'instagram']
      };
    }

    console.log('✅ Image analysis complete');
    return parsedAnalysis;

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Fallback analysis
    return {
      description: 'Image uploaded by user',
      mood: 'professional',
      elements: ['visual content'],
      themes: ['business'],
      hashtags: ['#business', '#content'],
      platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
      error: error.message
    };
  }
};

/**
 * Analyze a video thumbnail or extract frame
 * @param {string} videoUrl - URL of video or thumbnail
 * @param {object} businessContext - Business profile context
 * @returns {object} - Analysis similar to image
 */
export const analyzeVideo = async (videoUrl, businessContext = {}) => {
  try {
    console.log('🎥 Analyzing video thumbnail with AI vision...');
    
    // For videos, we analyze the thumbnail or a frame
    // Full video analysis would require additional processing
    const analysis = await analyzeImage(videoUrl, businessContext);
    
    return {
      ...analysis,
      contentType: 'video',
      suggestions: 'Video content - consider adding motion-based captions and call-to-actions'
    };

  } catch (error) {
    console.error('Error analyzing video:', error);
    return {
      description: 'Video uploaded by user',
      mood: 'dynamic',
      elements: ['video content'],
      themes: ['video', 'content'],
      hashtags: ['#video', '#content'],
      platforms: ['linkedin', 'twitter', 'facebook', 'instagram'],
      contentType: 'video',
      error: error.message
    };
  }
};

/**
 * Generate social media post based on media analysis
 * @param {object} mediaAnalysis - Result from analyzeImage or analyzeVideo
 * @param {string} platform - Target platform
 * @param {object} businessContext - Business profile
 * @returns {string} - Generated post content
 */
export const generatePostFromMedia = async (mediaAnalysis, platform, businessContext) => {
  try {
    console.log(`📝 Generating ${platform} post from media analysis...`);
    
    const prompt = `Create an engaging ${platform} post based on this visual content analysis:

Description: ${mediaAnalysis.description}
Mood: ${mediaAnalysis.mood}
Themes: ${mediaAnalysis.themes?.join(', ')}
Suggested Hashtags: ${mediaAnalysis.hashtags?.join(' ')}

Business Context:
- Business: ${businessContext.business_name || 'Unknown'}
- Industry: ${businessContext.industry || 'General'}
- Brand Voice: ${businessContext.brand_voice?.tone || 'Professional'}

Requirements:
- Write ONLY the post content (no explanations)
- Make it relevant to the image/video
- Match the brand voice
- Include relevant hashtags (${mediaAnalysis.hashtags?.slice(0, 5).join(' ')})
- Keep it platform-appropriate for ${platform}
- Be engaging and authentic

Generate the post now:`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a professional social media content creator. Generate engaging posts based on visual content analysis." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const postContent = response.choices[0].message.content.trim();
    console.log('✅ Post generated from media analysis');
    
    return postContent;

  } catch (error) {
    console.error('Error generating post from media:', error);
    
    // Fallback content
    return `Check out this amazing ${mediaAnalysis.contentType === 'video' ? 'video' : 'image'}! ${mediaAnalysis.description?.substring(0, 100)} ${mediaAnalysis.hashtags?.slice(0, 5).join(' ')}`;
  }
};

/**
 * Convert file to base64 for API submission
 * @param {File} file - File object from input
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Batch analyze multiple media files
 * @param {Array<File>} files - Array of file objects
 * @param {object} businessContext - Business profile
 * @returns {Promise<Array>} - Array of analyses
 */
export const analyzeMediaBatch = async (files, businessContext) => {
  console.log(`🔍 Analyzing ${files.length} media files...`);
  
  const analyses = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Analyzing file ${i + 1}/${files.length}: ${file.name}`);
    
    try {
      // Convert to base64
      const base64 = await fileToBase64(file);
      
      // Analyze based on type
      let analysis;
      if (file.type.startsWith('image/')) {
        analysis = await analyzeImage(base64, businessContext);
      } else if (file.type.startsWith('video/')) {
        analysis = await analyzeVideo(base64, businessContext);
      } else {
        console.warn(`Unsupported file type: ${file.type}`);
        continue;
      }
      
      analyses.push({
        file: file,
        fileName: file.name,
        fileType: file.type,
        fileUrl: URL.createObjectURL(file),
        analysis: analysis
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error analyzing ${file.name}:`, error);
    }
  }
  
  console.log(`✅ Completed analysis of ${analyses.length} files`);
  return analyses;
};
