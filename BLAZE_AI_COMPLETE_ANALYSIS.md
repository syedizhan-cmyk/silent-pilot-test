# 🎯 Blaze AI - Complete Competitive Analysis

**Analysis Date:** 2025-12-31  
**Sources:** Console logs, HAR network data, live application inspection

---

## 🔥 CRITICAL DISCOVERY: Content Generation Request

### The "Add More" Endpoint

**Endpoint:** `POST /v1/w/{workspace_id}/brand_plans/{plan_id}/schedules/{schedule_id}/add_more`

**Request Format:**
```json
{
  "contents": [
    {
      "type": "instagram_post",
      "topic": "",
      "post_at": "2026-01-02T20:30:00.000Z"
    },
    {
      "type": "tiktok_post",
      "topic": "",
      "post_at": "2026-01-02T23:30:00.000Z"
    },
    {
      "type": "youtube_short",
      "topic": "",
      "post_at": "2026-01-02T23:30:00.000Z"
    },
    {
      "type": "facebook_post",
      "topic": "",
      "post_at": "2026-01-02T18:30:00.000Z"
    },
    {
      "type": "linkedin_post",
      "topic": "",
      "post_at": "2026-01-02T18:30:00.000Z"
    },
    {
      "type": "newsletter",
      "topic": "",
      "post_at": "2026-01-02T19:30:00.000Z"
    },
    {
      "type": "blog_post",
      "topic": "",
      "post_at": "2026-01-02T19:30:00.000Z"
    },
    {
      "type": "crosspost_post",
      "topic": "",
      "post_at": "2026-01-02T20:30:00.000Z"
    },
    {
      "type": "video_crosspost_post",
      "topic": "",
      "post_at": "2026-01-02T20:30:00.000Z"
    }
  ]
}
```

**Key Observations:**
- ✅ Generates multiple content types in ONE request
- ✅ Empty "topic" fields = AI generates topics automatically
- ✅ Schedules content with specific timestamps
- ✅ Supports: Instagram, TikTok, YouTube Shorts, Facebook, LinkedIn, Newsletter, Blog, Crossposts, Video Crossposts

**Response:** Status 201 (Created) - Returns schedule with generated content

---

## 🏗️ COMPLETE TECHNOLOGY STACK

### Backend Architecture

**Framework:** Ruby on Rails
- Action Cable for WebSockets (wss://ws.blaze.ai/cable)
- RESTful API at app.blaze.ai/v1/*
- Custom API Gateway at capig.blaze.ai

**Database:** PostgreSQL (Rails default)

**Authentication:** JWT tokens (Bearer tokens in Authorization header)

### AI Services (Hidden Behind Proxy)

**API Gateway:** `capig.blaze.ai`
- Purpose: Hide actual AI provider
- Keeps API keys secret from frontend
- Proxies requests to real AI services

**Likely AI Stack** (based on output quality and industry standards):
- **Text Generation:** OpenAI GPT-4 or GPT-4 Turbo
- **Image Generation:** DALL-E 3, Midjourney, or Stable Diffusion XL
- **Video Generation:** RunwayML Gen-2/Gen-3, Pika Labs, or D-ID

**Why we know this:**
1. "capig.blaze.ai" = Custom API Gateway (common pattern)
2. No direct calls to OpenAI/Anthropic/etc. (they're hiding the provider)
3. This is smart - keeps their AI strategy secret
4. We need to do the same with Silent Pilot!

### Media Infrastructure

**Storage:**
- AWS S3 (us-west-1): `blaze-article-uploads.s3.us-west-1.amazonaws.com`
- AWS S3 (us-west-1): `blaze-media-uploads-for-dev.s3.us-west-1.amazonaws.com`
- AWS S3 (us-east-2): `capi-automation.s3.us-east-2.amazonaws.com`

**CDN & Delivery:**
- Cloudinary: `res.cloudinary.com`
- Cloudflare: `static.cloudflareinsights.com`

**Strategy:** Upload to S3, serve via Cloudinary CDN

### Third-Party Services

**Payments:**
- ✅ Stripe (js.stripe.com, api.stripe.com)
- Subscription management
- Payment processing

**Analytics & Tracking (8+ services!):**
- ✅ Datadog RUM - Performance monitoring
- ✅ Heap Analytics - Event tracking
- ✅ FullStory - Session replay
- ✅ Hotjar - Heatmaps & surveys
- ✅ Microsoft Clarity - Session recording
- ✅ Sentry - Error tracking
- ✅ Google Analytics - Web analytics
- ✅ Google Tag Manager - Tag management

**Customer Support:**
- ✅ Intercom - Live chat & help desk
- Identity verification issues noted

**Marketing & Attribution:**
- ✅ Meta Pixel (Facebook) - Conversion tracking
- ✅ Twitter Pixel - Twitter ads
- ✅ LinkedIn Insight Tag - LinkedIn ads
- ✅ Pinterest Tag - Pinterest ads
- ✅ Bing Ads - Microsoft advertising
- ✅ FirstPromoter - Affiliate tracking
- ✅ Leadsy - Lead generation

**Infrastructure:**
- ✅ CookieYes - Cookie consent management
- ✅ Apple ID Connect - Apple authentication

### Frontend

**Framework:** React
- Code splitting (separate chunks per feature)
- Modern build system (Webpack/Vite)
- Progressive Web App (manifest.json, service worker)

**Fonts:**
- Inter (variable font)
- Sohne (custom font)
- SpinnerRackProBB (display font)

**UI Library:** Custom components (not using MUI, Ant Design, etc.)

---

## 📊 CONFIRMED FEATURES

### Content Types Supported
1. ✅ **Instagram Posts** (posts, stories, reels)
2. ✅ **TikTok Posts**
3. ✅ **YouTube Shorts**
4. ✅ **Facebook Posts**
5. ✅ **LinkedIn Posts**
6. ✅ **Newsletter** (email campaigns)
7. ✅ **Blog Posts** (long-form content)
8. ✅ **Crossposts** (post to multiple platforms)
9. ✅ **Video Crossposts** (video to multiple platforms)

### Core Features
1. ✅ **Brand Plans** - Content strategies
2. ✅ **Brand Schedules** - Automated content calendars
3. ✅ **Brand Kits** - Brand colors, fonts, logos
4. ✅ **Brand Voices** - Tone and style profiles
5. ✅ **Brand Visual Kits** - Visual assets and templates
6. ✅ **Brand Profile** - Business information
7. ✅ **Scheduled Posts** - Content calendar view
8. ✅ **External Integrations** - Social platform connections
9. ✅ **Credit Usage** - Track API usage/credits
10. ✅ **Tier Usage** - Subscription plan limits
11. ✅ **Payment Plans** - Subscription management
12. ✅ **Autopilot Add-ons** - Extra automation features
13. ✅ **Virtual Marketer Plan** - AI agent subscription
14. ✅ **Files/Folders** - Media library
15. ✅ **Wizard Drafts** - Guided content creation
16. ✅ **Notifications** - User alerts
17. ✅ **Team Members** - Workspace collaboration
18. ✅ **Favorites** - Bookmarked items

### Content Generation Workflow
```
1. User creates "Brand Plan" (content strategy)
   ↓
2. System creates "Brand Schedule" (calendar of posts)
   ↓
3. User clicks "Add More" button
   ↓
4. POST request to /add_more endpoint with content types
   ↓
5. Backend (Rails) receives request
   ↓
6. Rails proxies to capig.blaze.ai (AI Gateway)
   ↓
7. AI Gateway calls real AI services (OpenAI, etc.)
   ↓
8. AI generates content based on Brand Profile + Brand Voice
   ↓
9. Content saved to database with schedule times
   ↓
10. User sees generated posts in calendar
```

---

## 💰 COST ANALYSIS

### Their Monthly Service Costs (Estimated)

**AI Services:**
- OpenAI GPT-4: $500-2,000/month (depends on volume)
- Image Generation: $200-500/month
- Video Generation: $500-1,000/month
**Subtotal: $1,200-3,500/month**

**Infrastructure:**
- AWS S3 + CloudFront: $50-200/month
- Cloudinary: $89-249/month
- Rails Hosting (Heroku/AWS): $200-1,000/month
**Subtotal: $339-1,449/month**

**Analytics & Tracking:**
- Datadog RUM: $15-50/month (per million sessions)
- Heap Analytics: $0-1,000/month
- FullStory: $199-1,999/month
- Hotjar: $39-389/month
- Microsoft Clarity: Free
- Sentry: $26-599/month
- Google Analytics: Free
**Subtotal: $279-4,037/month**

**Customer Support:**
- Intercom: $74-999/month
**Subtotal: $74-999/month**

**Payments:**
- Stripe: 2.9% + $0.30 per transaction
**Variable based on revenue**

**TOTAL ESTIMATED MONTHLY OVERHEAD: $1,892-9,985/month**

---

## 🚨 THEIR WEAKNESSES (Opportunities for Silent Pilot!)

### Performance Issues
1. ❌ **Stripe.js loaded multiple times** - Inefficient, slows page load
2. ❌ **WebSocket connection failures** - Unreliable real-time features
3. ❌ **CORS errors** - Security misconfiguration
4. ❌ **Multiple tracking services** - Massive overhead, privacy concerns

### Rate Limiting & Errors
1. ❌ **429 errors** - Rate limiting issues (hitting API limits)
2. ❌ **423 errors** - Resource locking (videos behind paywall?)
3. ❌ **422 errors** - Validation failures on events

### Security Issues
1. ❌ **Intercom identity verification broken** - Security vulnerability
2. ❌ **Meta Pixel traffic permissions** - Tracking broken
3. ❌ **Frame access violations** - CORS issues

### Complexity
1. ❌ **8+ analytics services** - Overkill, expensive, slow
2. ❌ **Ruby on Rails** - Slower than Node.js, harder to scale
3. ❌ **Complex architecture** - More moving parts = more failures

---

## 🎯 SILENT PILOT IMPLEMENTATION STRATEGY

### Phase 1: Core Content Generation (Week 1-2)

**Add Image Generation:**
```javascript
// Use multiple AI services for variety
const imageServices = {
  'dalle3': 'OpenAI DALL-E 3', // Best quality, $0.04-0.08/image
  'flux': 'Flux Pro', // Fast, good quality, $0.02/image
  'sdxl': 'Stable Diffusion XL', // Cheapest, $0.003/image
};

// Create API wrapper (like Blaze's capig)
export async function generateImage(prompt, style, service = 'flux') {
  const response = await fetch('/api/v1/generate/image', {
    method: 'POST',
    body: JSON.stringify({ prompt, style, service })
  });
  return response.json();
}
```

**Add Video Generation:**
```javascript
// Start with one provider, add more later
const videoServices = {
  'runway': 'RunwayML Gen-3', // Best quality
  'pika': 'Pika Labs', // Fast generation
};

export async function generateVideo(prompt, duration = 5) {
  const response = await fetch('/api/v1/generate/video', {
    method: 'POST',
    body: JSON.stringify({ prompt, duration })
  });
  return response.json();
}
```

**Improve Blog Generation:**
```javascript
// Use multiple models for better quality
export async function generateBlog(topic, options = {}) {
  // Use GPT-4 for structure, Claude for creativity
  const outline = await callGPT4(createOutlinePrompt(topic));
  const content = await callClaude(createContentPrompt(outline, topic));
  const seo = await optimizeForSEO(content);
  
  return { outline, content, seo };
}
```

### Phase 2: Brand Features (Week 3-4)

**Brand Kit (like Blaze):**
```sql
-- Database schema
CREATE TABLE brand_kits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  workspace_id UUID,
  name TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  font_heading TEXT,
  font_body TEXT,
  logo_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE brand_voices (
  id UUID PRIMARY KEY,
  workspace_id UUID,
  name TEXT,
  tone TEXT, -- casual, professional, friendly, etc.
  personality JSONB, -- traits like humorous, informative, etc.
  sample_text TEXT,
  created_at TIMESTAMP
);
```

**Brand Profile:**
```javascript
// Store brand context for AI
const brandProfile = {
  business_name: "...",
  industry: "...",
  target_audience: "...",
  unique_value_prop: "...",
  keywords: ["...", "..."],
  competitors: ["...", "..."],
};

// Use in AI prompts
const prompt = `Generate a social post for ${brandProfile.business_name}, 
a ${brandProfile.industry} company targeting ${brandProfile.target_audience}.
Tone: ${brandVoice.tone}. Keywords: ${brandProfile.keywords.join(', ')}.`;
```

### Phase 3: Content Scheduling Automation (Week 5-6)

**Auto-Generate Content Schedule:**
```javascript
// Similar to Blaze's "add_more" endpoint
export async function generateSchedule(options) {
  const { workspace_id, start_date, length, frequency, content_types } = options;
  
  // Generate posts for each content type
  const posts = [];
  for (const type of content_types) {
    const post = await generateContentForType(type, {
      brand_profile: await getBrandProfile(workspace_id),
      brand_voice: await getBrandVoice(workspace_id),
      schedule_date: calculateNextDate(start_date, posts.length),
    });
    posts.push(post);
  }
  
  return posts;
}
```

### Phase 4: API Gateway (Week 7-8)

**Create Our Own "capig" Wrapper:**
```javascript
// supabase/functions/ai-gateway/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  const { service, prompt, options } = await req.json();
  
  // Route to appropriate AI service
  switch (service) {
    case 'text':
      return await callTextAI(prompt, options);
    case 'image':
      return await callImageAI(prompt, options);
    case 'video':
      return await callVideoAI(prompt, options);
    default:
      return new Response('Unknown service', { status: 400 });
  }
});

async function callTextAI(prompt, options) {
  // Hide API keys from frontend
  const openai_key = Deno.env.get('OPENAI_API_KEY');
  const claude_key = Deno.env.get('ANTHROPIC_API_KEY');
  
  // Choose best model for task
  if (options.length > 2000) {
    // Long content - use GPT-4
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openai_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } else {
    // Short content - use Claude (cheaper)
    return await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claude_key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  }
}
```

---

## 📈 COMPETITIVE ADVANTAGES

### Where Silent Pilot Can Beat Blaze:

**1. Performance:**
- ✅ Supabase > Rails (faster, modern)
- ✅ Edge Functions > Traditional API (lower latency)
- ✅ Vercel > Their hosting (CDN, automatic optimization)

**2. Cost:**
- ✅ 2-3 analytics tools max (vs their 8+)
- ✅ More efficient AI usage
- ✅ Better pricing for customers

**3. Features:**
- ✅ Multiple AI model options (GPT-4, Claude, Gemini)
- ✅ Better social integrations (we already have OAuth!)
- ✅ More platforms supported

**4. Reliability:**
- ✅ No WebSocket failures (Supabase Realtime is solid)
- ✅ Better error handling
- ✅ No rate limiting issues

**5. User Experience:**
- ✅ Simpler onboarding
- ✅ Faster generation times
- ✅ More intuitive UI

---

## 🎯 RECOMMENDED IMPLEMENTATION ROADMAP

### Immediate (Week 1-2): Image Generation
**Effort:** 2-3 days
**Impact:** HIGH - Major feature gap

- [ ] Add Flux API integration (cheapest, fast)
- [ ] Create image generation UI
- [ ] Save images to Supabase Storage
- [ ] Add to content creation workflow

### High Priority (Week 3-4): Brand Kit
**Effort:** 4-5 days
**Impact:** HIGH - Key differentiator

- [ ] Create brand_kits table
- [ ] Create brand_voices table
- [ ] Build brand profile UI
- [ ] Integrate into AI prompts

### High Priority (Week 5-6): Video Generation
**Effort:** 5-7 days
**Impact:** HIGH - Major feature

- [ ] Choose video AI (RunwayML or Pika)
- [ ] Create video generation UI
- [ ] Handle long generation times (webhooks)
- [ ] Store videos efficiently

### Medium Priority (Week 7-8): Content Automation
**Effort:** 3-4 days
**Impact:** MEDIUM - Nice to have

- [ ] "Generate schedule" feature
- [ ] Bulk content creation
- [ ] Auto-topic generation
- [ ] Calendar integration

### Nice to Have (Week 9-10): Analytics
**Effort:** 2-3 days
**Impact:** LOW - Not critical

- [ ] Add Plausible Analytics (privacy-focused)
- [ ] Basic error tracking (Sentry free tier)
- [ ] User behavior tracking (minimal)

---

## 💡 KEY TAKEAWAYS

### What Blaze Does Well:
1. ✅ Clean, modern UI
2. ✅ Comprehensive feature set
3. ✅ Good onboarding flow
4. ✅ Multiple content types
5. ✅ API Gateway pattern (hiding AI providers)

### What We Can Do Better:
1. 🚀 **Faster performance** (Supabase > Rails)
2. 🚀 **Better reliability** (fewer failures)
3. 🚀 **More AI options** (GPT-4, Claude, Gemini, Flux, etc.)
4. 🚀 **Better pricing** (lower overhead)
5. 🚀 **Simpler architecture** (less complexity)

### What We Need to Build:
1. ⚠️ **Image generation** (critical gap)
2. ⚠️ **Video generation** (critical gap)
3. ⚠️ **Brand kit system** (nice to have)
4. ⚠️ **Content automation** (nice to have)
5. ⚠️ **API gateway** (security best practice)

---

## 🔒 SECURITY RECOMMENDATIONS

**Follow Blaze's Pattern:**
1. ✅ Hide AI API keys behind Edge Functions
2. ✅ Use JWT tokens for authentication
3. ✅ Never expose AI provider directly
4. ✅ Rate limit on backend, not frontend

**Improve on Blaze:**
1. ✅ Fix identity verification (they have issues)
2. ✅ Proper CORS configuration
3. ✅ Better error handling
4. ✅ Fewer tracking services (privacy)

---

## 📊 ESTIMATED COSTS FOR SILENT PILOT

**AI Services:**
- GPT-4: $200-500/month (use Claude when possible)
- Image (Flux): $100-200/month
- Video (Pika): $300-500/month
**Subtotal: $600-1,200/month**

**Infrastructure:**
- Supabase: $25-99/month (already have)
- Vercel: $0-20/month (already have)
- Cloudinary or Bunny CDN: $0-49/month
**Subtotal: $25-168/month**

**Analytics (Minimal):**
- Plausible Analytics: $9/month
- Sentry (error tracking): $0-26/month
**Subtotal: $9-35/month**

**TOTAL: $634-1,403/month**

**Blaze spends: $1,892-9,985/month**
**We save: $1,258-8,582/month (66-86% cheaper!)**

---

## ✅ NEXT STEPS

1. **Start with image generation** (biggest gap)
2. **Add brand kit feature** (key differentiator)
3. **Implement video generation** (high-value feature)
4. **Create API gateway** (security best practice)
5. **Optimize costs** (use cheaper AI when possible)

**We can build a better product for 1/3 the cost!** 🚀

---

**Analysis Complete!** 🎉

Ready to implement? Start with image generation - it's the quickest win!
