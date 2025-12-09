# 🚀 AI Features Setup Guide

## What's New

Your Silent Pilot platform now has advanced AI capabilities for personalized content creation and media generation!

### New Features Added:

1. **🏢 Business Profile System**
   - Teach AI about your business, products, and services
   - Define target audience and pain points
   - Set brand voice and values
   - All content generated will be personalized to YOUR business

2. **🎨 AI Media Studio**
   - Generate AI images for posts
   - Create infographic content structures
   - Generate video scripts for TikTok/Reels
   - Design carousel post content
   - Create blog post outlines
   - Generate email newsletters
   - Write ad copy for multiple platforms
   - Batch generate content for your calendar
   - Repurpose content across platforms

## Setup Instructions

### Step 1: Run SQL for Business Profiles

1. Open your Supabase dashboard: https://app.supabase.com
2. Go to SQL Editor
3. Run the SQL from `BUSINESS_PROFILE_SQL.sql`
4. This creates the `business_profiles` table

### Step 2: Complete Your Business Profile

1. Log into your dashboard
2. Navigate to **🏢 Business Profile** (in the sidebar)
3. Fill out all sections:
   - Basic Information (business name, industry, description)
   - Products & Services (add what you offer)
   - Target Audience (demographics, pain points, interests)
   - Brand Voice & Style (tone, style, keywords)
   - Brand Values

4. Click **Save Business Profile**

### Step 3: Test AI Content Generation

1. Go to **✍️ Create Content**
2. Toggle on "AI Assistant"
3. Enter a prompt (e.g., "Write a LinkedIn post about our services")
4. The AI will now generate content specifically tailored to YOUR business!

### Step 4: Explore AI Media Studio

1. Navigate to **🎨 AI Media Studio** (in the sidebar)
2. Try different media types:
   - **Images**: Generate AI images (placeholder - integrate with DALL-E/Midjourney)
   - **Infographics**: Get structured infographic content
   - **Videos**: Create TikTok/Reels scripts
   - **Carousels**: Multi-slide Instagram/LinkedIn posts
   - **Blogs**: SEO-optimized blog outlines
   - **Newsletters**: Email content with high CTR
   - **Ads**: Platform-specific ad copy
   - **Batch**: Generate 7-30 posts at once
   - **Repurpose**: Transform one piece into multiple formats

## How It Works

### Personalized AI Content

Before:
```
Generic AI prompt → Generic content
```

After:
```
Your prompt + Business Context → Personalized, brand-aligned content
```

The AI now knows:
- Your business name and industry
- Your products/services
- Your target audience and their pain points
- Your brand voice and tone
- Your brand values

### Example

**Without Business Profile:**
```
Prompt: "Write about productivity"
Result: Generic productivity tips
```

**With Business Profile:**
```
Prompt: "Write about productivity"
Business Context: SaaS company selling project management software
                  to small business owners aged 30-50
                  Brand voice: Professional yet approachable
                  
Result: "Struggling to keep your team on track? Here's how [Your Product]
        helps small businesses boost productivity by 40%..."
```

## Integration Options

### For AI Image Generation

The system currently uses placeholders. To enable real AI images, integrate one of:

1. **DALL-E 3** (OpenAI)
   - API: https://platform.openai.com/docs/guides/images
   - Cost: ~$0.040 per image
   - Quality: Excellent

2. **Stability AI** (Stable Diffusion)
   - API: https://stability.ai/
   - Cost: ~$0.01 per image
   - Quality: Great, more customizable

3. **Leonardo.ai**
   - API: https://leonardo.ai/
   - Free tier: 150 tokens/day
   - Quality: Excellent for marketing images

4. **Midjourney**
   - Via unofficial API
   - Quality: Best, but requires subscription

### Implementation Example (DALL-E):

Update `src/lib/mediaGenerator.js`:

```javascript
export const generateAIImage = async (prompt, businessContext = '', style = 'professional') => {
  const openai = new OpenAI({ apiKey: process.env.REACT_APP_OPENAI_API_KEY });
  
  const enhancedPrompt = businessContext 
    ? `${prompt}. Style: ${style}. Context: ${businessContext}`
    : prompt;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: enhancedPrompt,
    n: 1,
    size: "1024x1024",
  });
  
  return {
    success: true,
    imageUrl: response.data[0].url,
    prompt: enhancedPrompt
  };
};
```

## Automation Features

### Content Scheduling

The system automatically:
- Schedules posts from your calendar
- Posts to connected social accounts
- Tracks engagement and analytics

### Batch Generation

Generate a week/month of content in one go:
1. Go to AI Media Studio → Content Batch
2. Set theme (e.g., "Product launch campaign")
3. Choose platforms and number of posts
4. Get a complete content calendar instantly

### Content Repurposing

Turn one blog post into:
- 5 Twitter threads
- 3 LinkedIn posts
- 2 Instagram carousels
- 1 Email newsletter
- 10 social media quotes

## Best Practices

### 1. Complete Business Profile First
The more detailed your profile, the better the AI-generated content.

### 2. Update Regularly
Update your products, services, and target audience as they evolve.

### 3. Use Specific Prompts
Instead of: "Write a post"
Try: "Write a LinkedIn post announcing our new feature that helps small businesses save 5 hours per week"

### 4. Review and Edit
Always review AI-generated content before posting. Add your personal touch.

### 5. Batch Generate Strategically
Generate content in themed batches for campaigns:
- Product launches
- Seasonal campaigns
- Educational series
- Behind-the-scenes weeks

## Troubleshooting

### Content Not Personalized?
- Check if your Business Profile is complete
- Restart your development server after saving profile
- Verify business context is loading in console logs

### AI Generation Failing?
- Check Gemini API key in .env
- Verify API is enabled in Google Cloud Console
- Check browser console for errors

### Need Different AI Model?
The system uses Gemini 2.5 Flash by default. You can add:
- OpenAI GPT-4 for higher quality
- Groq for faster generation
- Multiple models for fallback

## Next Steps

1. ✅ Run SQL to create business_profiles table
2. ✅ Complete your Business Profile
3. ✅ Test personalized content generation
4. ✅ Explore AI Media Studio
5. ✅ Generate a week of content
6. ⭐ Optional: Integrate DALL-E for real AI images
7. ⭐ Optional: Set up automated posting workflow

## Support

If you need help:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure Supabase tables are created
4. Test with simple prompts first

Enjoy your new AI-powered content creation system! 🚀