# Fix AI Media Studio - Database Setup

## Problem
AI Media Studio is showing error: "Could not find the table 'public.media_library' in the schema cache"

## Solution
You need to create the required database tables in Supabase.

---

## Step 1: Run SQL in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qzvqnhbslecjjwakusva
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from `AI_MEDIA_STUDIO_SQL.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

---

## Step 2: Verify Tables Created

After running the SQL, verify the tables exist:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these new tables:
   - ✅ `media_library`
   - ✅ `generated_media`
   - ✅ `ai_generations`

---

## Step 3: Test AI Media Studio

1. Go to your website: https://silent-pilot-website-3upgyz9v2-syed-izhan-ahmeds-projects.vercel.app
2. Navigate to AI Media Studio
3. Try generating an image
4. The error should be gone!

---

## What These Tables Do

### `media_library`
Stores uploaded media files (images, videos, audio)
- Used by Bulk Media Upload
- Used by Content Library
- Stores file URLs, types, sizes

### `generated_media`
Stores AI-generated images
- Used by AI Media Studio
- Tracks prompts, styles, providers
- Stores generated image URLs

### `ai_generations`
Tracks all AI generation requests
- Used by AI Media Studio
- Used by AI Content Generator
- Tracks generation history and status

---

## Quick Copy-Paste SQL

Open `AI_MEDIA_STUDIO_SQL.sql` in the project folder and copy all the SQL, then paste it into Supabase SQL Editor.

---

## Alternative: Run from Command Line

If you have Supabase CLI configured:

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Silent\ Pilot\ Website
supabase db execute --file AI_MEDIA_STUDIO_SQL.sql
```

---

## Verification Query

After creating tables, run this in SQL Editor to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('media_library', 'generated_media', 'ai_generations');
```

You should see all 3 tables listed.

---

## If You Still Get Errors

1. **Clear browser cache** and reload the page
2. **Check RLS policies** are enabled (SQL does this automatically)
3. **Verify you're logged in** to the website
4. **Check browser console** for any other errors

---

## Need Help?

The SQL file creates:
- 3 tables with proper structure
- Row Level Security (RLS) policies
- Indexes for performance
- Proper foreign key relationships

All tables are automatically configured to only allow users to see their own data.

---

**Status**: Ready to run  
**File**: AI_MEDIA_STUDIO_SQL.sql  
**Time to fix**: 2-3 minutes
