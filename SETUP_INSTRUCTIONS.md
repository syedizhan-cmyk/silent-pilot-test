# 🚀 Complete Setup Instructions

## Step 1: Configure Supabase (5 minutes)

### A. Add Your Anon Key

1. Go to: https://supabase.com/dashboard/project/qzvqnhbslecjjwakusva
2. Click **Settings** → **API**
3. Copy the **anon** **public** key
4. Open `.env` file in your project
5. Replace `YOUR_ANON_KEY_HERE` with your key

Your `.env` should look like:
```
REACT_APP_SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```

### B. Set Up Database

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Open `SUPABASE_SQL_SETUP.sql` file from your project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success" message

You should see:
```
✅ Database schema created successfully!
📊 Tables created: profiles, posts, social_accounts...
```

## Step 2: Get OpenAI API Key (Optional - for AI)

1. Go to: https://platform.openai.com/api-keys
2. Sign up / Log in
3. Click **Create new secret key**
4. Copy the key
5. Add to `.env`:
```
REACT_APP_OPENAI_API_KEY=sk-...
```

## Step 3: Restart Your App

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm start
```

## Step 4: Test Everything

### Test 1: Sign Up
1. Go to http://localhost:3000
2. Click "Get Started"
3. Create an account
4. You should get confirmation

### Test 2: Login
1. Go to http://localhost:3000/login
2. Enter your credentials
3. Should redirect to dashboard

### Test 3: AI Content Generation
1. In dashboard, go to "Create Content"
2. Turn on AI Assistant
3. Enter: "Write a LinkedIn post about AI"
4. Click "Generate with AI"
5. Content should appear!

### Test 4: Schedule Post
1. Select date & time
2. Click "Schedule Post"
3. Go to Calendar
4. Your post should appear!

## Troubleshooting

### Issue: "Failed to initialize"
**Fix:** Check your Supabase URL and anon key in `.env`

### Issue: "Failed to generate content"
**Fix:** Add OpenAI API key to `.env`

### Issue: Tables not found
**Fix:** Run the SQL setup again in Supabase

### Issue: Changes not working
**Fix:** Restart the app with `npm start`

## ✅ You're Ready!

Once setup is complete, you have:
- ✅ Working authentication
- ✅ Database storage
- ✅ AI content generation
- ✅ Content scheduling
- ✅ Calendar view

## 🎯 Next: Phase 2

Now we can add:
- Social media posting
- Analytics tracking
- Email campaigns
- And more!
