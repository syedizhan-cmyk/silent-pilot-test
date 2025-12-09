# 🔑 API Keys Setup

## ✅ WHAT I'VE DONE

1. ✅ Configured Supabase URL: https://qzvqnhbslecjjwakusva.supabase.co
2. ✅ Installed all required packages
3. ✅ Created social media integration
4. ✅ Created leads management
5. ✅ Created analytics tracking
6. ✅ Added Social Accounts page

## 📝 WHAT YOU NEED TO DO

### 1. Add Supabase Anon Key (REQUIRED)

**Where to get it:**
1. Go to: https://supabase.com/dashboard/project/qzvqnhbslecjjwakusva
2. Click Settings → API
3. Copy the "anon" "public" key

**Where to add it:**
Open `.env` file and replace this line:
```
REACT_APP_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

With:
```
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1... (your actual key)
```

### 2. Set Up Database (REQUIRED)

**Steps:**
1. In Supabase, click **SQL Editor**
2. Click **New Query**
3. Open file: `SUPABASE_SQL_SETUP.sql`
4. Copy ALL the SQL code
5. Paste into Supabase
6. Click **Run**

This creates all the tables needed for:
- Users & profiles
- Posts & content
- Social accounts
- Campaigns
- Leads
- Email campaigns
- Analytics

### 3. Add OpenAI Key (REQUIRED for AI)

**Where to get it:**
1. Go to: https://platform.openai.com/api-keys
2. Sign up if needed (free account available)
3. Click **Create new secret key**
4. Copy the key

**Where to add it:**
Open `.env` file and add:
```
REACT_APP_OPENAI_API_KEY=sk-... (your actual key)
```

**Note:** OpenAI free tier gives you $5 in credits. Good for ~100 content generations!

### 4. Restart Your App

After adding keys:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm start
```

## ✅ Check Your .env File

It should look like this:

```
# Supabase
REACT_APP_SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
REACT_APP_OPENAI_API_KEY=sk-proj-...
```

## 🧪 How to Test

Once keys are added and database is set up:

1. **Test Signup:**
   - Go to http://localhost:3000/signup
   - Create account
   - Should work!

2. **Test AI:**
   - Login → Create Content
   - Turn on AI
   - Generate content
   - Should work!

3. **Test Social Connect:**
   - Login → Social Accounts (new menu item!)
   - See available platforms
   - Click Connect (simulation for now)

## 💡 Quick Setup (5 minutes)

1. Get Supabase anon key → Add to .env
2. Run SQL setup → Creates tables
3. Get OpenAI key → Add to .env
4. Restart app → npm start
5. Test! → Create account & generate content

## 🆘 Need Help?

**Supabase Issues:**
- Check you're logged into the right project
- Make sure URL matches in .env
- Verify anon key is copied completely

**OpenAI Issues:**
- Make sure key starts with "sk-"
- Check you have credits remaining
- Free tier: $5 in credits

**Database Issues:**
- Make sure SQL ran successfully
- Check for error messages
- Try running SQL again if needed

## 📊 What Works After Setup

| Feature | Status |
|---------|--------|
| User Signup | ✅ Real database |
| User Login | ✅ Real authentication |
| AI Generation | ✅ Real OpenAI |
| Save Posts | ✅ Real database |
| Schedule Posts | ✅ Real database |
| View Calendar | ✅ Real data |
| Social Connect | ✅ UI ready |
| Leads | ✅ Database ready |
| Analytics | ✅ Tracking ready |

## 🚀 Ready!

Once you add the keys, everything will work!

**Paste your Supabase anon key here and I'll continue with Phase 2! 🎯**
