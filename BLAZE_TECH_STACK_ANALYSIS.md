# Blaze AI - Complete Technology Stack Analysis (from Console Data)

**Analysis Date:** 2025-12-31  
**Source:** Browser console logs from live Blaze application

---

## 🎯 KEY FINDINGS

### Application Architecture

**Backend Domain:** `app.blaze.ai`  
**WebSocket Server:** `wss://ws.blaze.ai/cable` (Action Cable - Ruby on Rails)  
**Asset Domain:** `react-assets.app.blaze.ai`

### Frontend Framework
- ✅ **React** (confirmed from bundle names and patterns)
- ✅ **React Router** (index.hG499CSODX.js pattern)
- ✅ **Code splitting** (App.XtovCYPBD4.chunk.js, ScheduledPosts.DXSY_QtxiB.chunk.js)
- ✅ **Modern build system** (Webpack or Vite with content hashing)

---

## 📦 THIRD-PARTY SERVICES & INTEGRATIONS

### 1. Payment Processing
- ✅ **Stripe** (js.stripe.com, merchant-ui-api.stripe.com, api.stripe.com)
  - Payment handling
  - Subscription management
  - Warning: "Stripe.js loaded more than once" (performance issue)

### 2. Analytics & Tracking
- ✅ **Microsoft Clarity** (clarity.js, s.clarity.ms/collect)
  - Session recording
  - Heatmaps
  - User behavior tracking
  
- ✅ **Meta (Facebook) Pixel** (ID: 106007782596223, 1563423343787935)
  - Conversion tracking
  - Custom events: `scroll`, `authed_session`, `Brand_Kit_Created`, `brand_kit_created`, `cookie_consent_update`
  - Traffic permission issues noted
  
- ✅ **Google Tag Manager** (GTM-PJ5D6SKK)
  - Tag management
  - Event tracking
  
- ✅ **Datadog RUM** (browser-intake-datadoghq.com)
  - Real User Monitoring
  - Performance tracking
  - API Key: pub5bf6a81599f9e6f4db7e89a8f040ec55

### 3. Customer Support
- ✅ **Intercom** (frame.48acc92d.js, app.intercom.com)
  - Live chat
  - Customer messaging
  - User onboarding
  - Warning: Identity verification issues (user_hash invalid)

### 4. Media & Assets
- ✅ **Cloudinary** (res.cloudinary.com/almanac)
  - Image hosting and optimization
  - CDN delivery
  - Automatic format conversion (AVIF, WebP, auto quality)
  - Responsive images (dpr_auto, dynamic widths)
  - Example: `/onboarding_assets/sider_images/1.jpeg`

### 5. WebSocket (Real-time Features)
- ✅ **Action Cable** (wss://ws.blaze.ai/cable)
  - Ruby on Rails WebSocket framework
  - Real-time updates
  - Live collaboration features
  - Connection issues noted in logs

---

## 🚨 IMPORTANT DISCOVERIES

### Backend Technology
**Ruby on Rails confirmed!**
- Action Cable (Rails WebSocket framework) = Rails backend
- This means Blaze likely uses:
  - Ruby on Rails API
  - PostgreSQL database (Rails default)
  - ActiveJob for background processing
  - Sidekiq or similar for job queue

### Video Generation Evidence
```
professional_engineer_worker_man_in_safety_uniform-6b552950d7aca3e7a8ed.mp4
```
- ✅ Video generation confirmed
- Status 423 (Locked) - likely rate limited or subscription gated
- Using MP4 format
- Descriptive filenames (AI-generated or user-uploaded)

### Brand Kit Feature
```
Brand_Kit_Created event
brand_kit_created event
```
- ✅ Brand customization feature
- Stores brand colors, fonts, logos
- Used for consistent content generation

### Scheduled Posts
```
ScheduledPosts.DXSY_QtxiB.chunk.js
```
- ✅ Content scheduling feature
- Separate code chunk for performance

---

## 🔍 WHAT'S MISSING (Need Network Tab)

**To identify AI services, I need to see:**
- API calls to OpenAI, Anthropic, Replicate, etc.
- Request/response patterns for content generation
- Image generation endpoints
- Video generation endpoints

**Currently unclear:**
- ❓ Which text AI model (GPT-4, Claude, Gemini?)
- ❓ Which image AI (DALL-E, Midjourney, Stable Diffusion, Flux?)
- ❓ Which video AI (RunwayML, Pika, Synthesia?)

---

## 🏗️ INFRASTRUCTURE ANALYSIS

### Performance Optimizations
- ✅ Preconnect to external services (Cloudinary, Stripe, etc.)
- ✅ Code splitting (separate chunks per feature)
- ✅ Lazy loading images
- ✅ AVIF/WebP image formats with fallbacks
- ✅ Responsive images with DPR (Device Pixel Ratio) optimization

### Architecture Pattern
```
Frontend: React SPA
    ↓
Backend: Ruby on Rails API
    ↓
WebSocket: Action Cable (real-time)
    ↓
AI Services: ??? (need to see API calls)
    ↓
Media: Cloudinary CDN
```

---

## 🎨 FEATURES IDENTIFIED FROM CONSOLE

### Confirmed Features:
1. ✅ **Brand Kit** - Custom branding (colors, fonts, logos)
2. ✅ **Scheduled Posts** - Content calendar/scheduling
3. ✅ **Video Generation** - MP4 video creation
4. ✅ **Image Generation** - (Cloudinary hosting suggests images)
5. ✅ **Real-time Updates** - WebSocket for live features
6. ✅ **User Authentication** - Session tracking, authed_session events
7. ✅ **Onboarding Flow** - onboarding_assets referenced
8. ✅ **Tracking Pixels** - Marketing integrations

### Possible Features:
- Professional templates (engineer/worker imagery)
- Multi-user collaboration (WebSocket suggests)
- Brand profile management
- Cookie consent management
- Event tracking for user actions

---

## 💰 COST IMPLICATIONS

### Monthly Service Costs (Estimated for Blaze):
- **Stripe:** 2.9% + $0.30 per transaction
- **Cloudinary:** $0-99/month (depending on usage)
- **Intercom:** $74-999/month (depending on seats)
- **Datadog RUM:** $15 per million sessions
- **Meta Pixel:** Free
- **Google Tag Manager:** Free
- **Clarity:** Free
- **Rails Hosting:** $50-500+/month (depends on scale)

### What This Means for Silent Pilot:
- We're already using Supabase (cheaper than Rails + PostgreSQL)
- We have Stripe integration ✅
- We DON'T have: Clarity, Intercom, Datadog (yet)
- We DO need: Better image hosting (Cloudinary competitor)

---

## 🔧 TECHNICAL ISSUES DETECTED

### Problems in Blaze:
1. ❌ **Stripe.js loaded multiple times** - Performance issue
2. ❌ **WebSocket connection failures** - Reliability issue
3. ❌ **Meta Pixel traffic permissions** - Tracking broken
4. ❌ **Intercom identity verification** - Security misconfiguration
5. ❌ **CORS errors** - Blocked frame access (Stripe, GTM)
6. ❌ **429 errors** - Rate limiting issues
7. ❌ **423 errors** - Locked resources (video paywall?)
8. ❌ **422 errors** - Validation failures on events endpoint

### What This Tells Us:
- Blaze has scaling/performance issues
- Their tracking isn't perfect
- Video generation might be rate-limited
- Security configuration issues (identity verification)
- **Silent Pilot can do better!**

---

## 🎯 RECOMMENDATIONS FOR SILENT PILOT

### 1. Match Their Features ✅
**Brand Kit:**
- Add brand profile (colors, fonts, logos)
- Use in content generation prompts
- Store in Supabase

**Video Generation:**
- Add video creation feature
- Use RunwayML or Pika Labs API
- Host videos on Cloudinary or Bunny CDN

**Scheduled Posts:**
- Already have! ✅

### 2. Improve on Their Weaknesses 🚀
**Performance:**
- Avoid loading services multiple times
- Better WebSocket reliability
- Faster asset loading

**Tracking:**
- Simpler analytics stack
- Privacy-focused (less invasive than Blaze)

**User Experience:**
- Smoother onboarding
- Better error handling
- No rate limiting on core features

### 3. Add These Services 📦
**Image Hosting:**
- ✅ Use Cloudinary OR
- ✅ Use Bunny CDN (cheaper alternative)
- ✅ Or Supabase Storage (simplest)

**Session Recording (Optional):**
- LogRocket (better than Clarity)
- Hotjar (simpler)
- FullStory (enterprise)

**Customer Support:**
- Crisp (cheaper than Intercom)
- Plain.com (modern alternative)
- Tawk.to (free option)

### 4. Tech Stack Comparison

| Service Category | Blaze Uses | Silent Pilot Uses | Recommendation |
|-----------------|------------|-------------------|----------------|
| Backend | Ruby on Rails | Supabase | ✅ Keep Supabase (better) |
| Database | PostgreSQL | PostgreSQL | ✅ Same |
| WebSocket | Action Cable | Supabase Realtime | ✅ Keep Supabase |
| Payments | Stripe | Stripe | ✅ Same |
| Images | Cloudinary | None | ⚠️ Add Cloudinary or Bunny |
| Analytics | Datadog, Clarity, Meta | None | ⚠️ Add basic analytics |
| Support | Intercom | None | ⚠️ Add Crisp or Plain |
| Frontend | React | React | ✅ Same |
| Hosting | Unknown | Vercel | ✅ Keep Vercel |

---

## 🔍 NEXT STEPS - WHAT I STILL NEED

### Critical Information Missing:
1. **Network Tab Data** - To see API calls for:
   - Text generation (OpenAI? Claude? Gemini?)
   - Image generation (DALL-E? Midjourney? Flux?)
   - Video generation (RunwayML? Pika?)

### How to Get This:
**Open Network Tab and generate content:**
1. Open DevTools (F12)
2. Go to "Network" tab
3. Click "Clear" to start fresh
4. Generate a blog post
5. Look for API calls (openai.com, anthropic.com, replicate.com, etc.)
6. Screenshot or copy the URLs
7. Check request headers and response

**Then:**
- Generate an image (watch Network tab)
- Generate a video (watch Network tab)
- Screenshot all API calls

This will tell us EXACTLY what AI services they use!

---

## 💡 IMMEDIATE ACTION ITEMS

### Can Implement Now:
1. ✅ Add Cloudinary for image hosting (2 hours)
2. ✅ Create Brand Kit feature (4-8 hours)
3. ✅ Add basic analytics (Plausible or Umami) (2 hours)
4. ✅ Implement video generation placeholder (2 hours)

### Need More Info:
1. ⏳ Identify their AI models (need Network tab)
2. ⏳ Match content generation quality (need to see outputs)
3. ⏳ Understand their pricing model (need to explore plans)

---

**This is excellent progress! The console data revealed:**
- ✅ Backend: Ruby on Rails
- ✅ Frontend: React
- ✅ Services: Stripe, Cloudinary, Intercom, Datadog, Meta Pixel
- ✅ Features: Brand Kit, Scheduled Posts, Video Generation
- ✅ Issues: Multiple performance and tracking problems

**Next: Need Network tab data to identify AI services! 🎯**
