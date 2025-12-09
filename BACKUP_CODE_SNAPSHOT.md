# Silent Pilot Website - Code Snapshot & Implementation Details
## Complete backup of key implementations and logic

---

## 📋 Table of Contents
1. [Core Configuration](#core-configuration)
2. [Authentication System](#authentication-system)
3. [Social Media Integration](#social-media-integration)
4. [AI Content Generation](#ai-content-generation)
5. [State Management](#state-management)
6. [API Integrations](#api-integrations)
7. [Edge Functions](#edge-functions)
8. [Database Schema](#database-schema)
9. [Utility Functions](#utility-functions)
10. [Component Patterns](#component-patterns)

---

## 🔧 Core Configuration

This section will contain actual code snapshots from your implementation.
The backup script below will populate these sections with real code.

### Supabase Client Setup
**File**: `src/lib/supabase.js`
- Supabase client initialization
- Auth configuration
- Storage configuration

### Environment Variables Template
**File**: `.env.example`
- All required API keys
- Configuration values
- Third-party service credentials

### Package Dependencies
**File**: `package.json`
- Complete dependency list
- Scripts configuration
- Project metadata

---

## 🔐 Authentication System

### Auth Store
**File**: `src/store/authStore.js`
- Zustand store implementation
- Login/logout logic
- Session management
- User state persistence

### Login Component
**File**: `src/pages/Login.js`
- Form handling
- OAuth integration
- Error handling
- Redirect logic

### Protected Routes
**File**: `src/components/ProtectedRoute.js`
- Route protection logic
- Auth state checking
- Redirect handling

---

## 📱 Social Media Integration

### Social Authentication
**File**: `src/lib/socialAuth.js`
- OAuth flow implementations
- Platform-specific auth handlers
- Token management
- Error handling for each platform

### Social Media API Wrapper
**File**: `src/lib/socialMediaAPI.js`
- Unified API interface
- Platform-specific posting logic
- Media upload handling
- Rate limiting
- Error handling

### Social Connect UI
**File**: `src/pages/SocialConnect.js`
- Connection management
- Platform status display
- Reconnection logic
- Token refresh handling

---

## 🤖 AI Content Generation

### OpenAI Integration
**File**: `src/lib/openai.js`
- API client setup
- Content generation functions
- Prompt engineering
- Error handling

### Gemini Integration
**File**: `src/lib/gemini.js`
- Google AI setup
- Content generation
- Response parsing

### Auto Content Generator
**File**: `src/lib/autoContentGenerator.js`
- Multi-provider orchestration
- Content optimization
- Scheduling logic
- Fallback mechanisms

### Media Generator
**File**: `src/lib/mediaGenerator.js`
- Image generation
- Style management
- Prompt optimization

---

## 🗄️ State Management

### Auth Store
**File**: `src/store/authStore.js`
- User authentication state
- Session management

### Social Store
**File**: `src/store/socialStore.js`
- Connected platforms
- Post history
- Platform status

### Content Store
**File**: `src/store/contentStore.js`
- Content items
- Drafts management
- Publishing state

### Analytics Store
**File**: `src/store/analyticsStore.js`
- Metrics tracking
- Data aggregation
- Chart data processing

---

## 🌐 API Integrations

### Twitter/X API
- OAuth 2.0 implementation
- Tweet posting
- Media upload
- Thread creation

### Facebook API
- OAuth flow
- Page posting
- Graph API calls
- Permission handling

### LinkedIn API
- OAuth 2.0
- Post creation
- Company page posting

### Instagram API
- Business account posting
- Media requirements
- Carousel posts

---

## ⚡ Edge Functions

### OAuth Exchange
**File**: `supabase/functions/oauth-exchange/index.ts`
- Token exchange logic
- Platform routing
- Error handling
- Database storage

### Social Post
**File**: `supabase/functions/social-post/index.ts`
- Platform-specific posting
- Media handling
- Error recovery
- Response formatting

### Scheduler
**File**: `supabase/functions/scheduler/index.ts`
- Cron job implementation
- Queue processing
- Retry logic

### SEO Analyzer
**File**: `supabase/functions/seo-analyzer/index.ts`
- Web scraping
- Meta tag analysis
- Recommendations engine

---

## 🗃️ Database Schema

### Users & Authentication
```sql
-- User accounts table
-- OAuth providers
-- Sessions
```

### Social Media
```sql
-- social_connections
-- scheduled_posts
-- post_history
-- analytics_data
```

### Content Management
```sql
-- content_items
-- media_library
-- tags
-- categories
```

### Business & Campaigns
```sql
-- business_profiles
-- campaigns
-- ad_campaigns
-- email_campaigns
-- leads
```

### AI & Automation
```sql
-- autopilot_settings
-- ai_prompts
-- generation_history
```

---

## 🛠️ Utility Functions

### Date & Time Helpers
- Timezone handling
- Schedule formatting
- Relative time display

### Media Processing
- Image optimization
- Format conversion
- Upload handling

### API Error Handlers
- Retry logic
- Rate limit handling
- User-friendly messages

---

## 🎨 Component Patterns

### Theme Context
**File**: `src/context/ThemeContext.js`
- Dark/light mode
- Theme persistence
- CSS variable management

### Dashboard Layout
**File**: `src/components/dashboard/DashboardLayout.js`
- Navigation structure
- Responsive layout
- User menu

### Calendar Component
**File**: `src/pages/Calendar.js`
- Month/week/day views
- Drag and drop
- Event creation
- Modal handling

---

## 📦 Build & Deployment

### Build Configuration
- React build settings
- Environment variable handling
- Optimization settings

### Deployment Scripts
- Vercel deployment
- Edge function deployment
- Database migrations

---

## 🔍 Code Search Index

### Key Functions to Find
- `handleLogin()` → authStore.js
- `connectSocialAccount()` → socialAuth.js
- `postToSocial()` → socialMediaAPI.js
- `generateContent()` → autoContentGenerator.js
- `schedulePost()` → scheduler.js
- `analyzeWebsite()` → seo-analyzer/index.ts

### Key Components
- `<Header>` → components/Header.js
- `<Dashboard>` → pages/Dashboard.js
- `<Calendar>` → pages/Calendar.js
- `<CreateContent>` → pages/CreateContent.js
- `<AutoPilot>` → pages/AutoPilot.js

### Key Hooks
- `useAuth()` → authStore.js
- `useSocial()` → socialStore.js
- `useTheme()` → ThemeContext.js

---

**Note**: This is a template structure. The actual code will be extracted
and populated by the backup script below.

