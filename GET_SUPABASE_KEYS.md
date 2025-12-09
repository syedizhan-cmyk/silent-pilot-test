# 🔑 How to Get Your Supabase Keys

## Direct Link (Click This!)

👉 **https://supabase.com/dashboard/project/qzvqnhbslecjjwakusva/settings/api**

This takes you directly to your API keys page!

---

## What You'll See

On that page, you'll see:

### 1. Project URL ✅
```
https://qzvqnhbslecjjwakusva.supabase.co
```
**I already have this!** ✅

### 2. API Keys 🔑

You'll see two keys listed:

#### **anon / public key**
- Starts with: `eyJ...`
- It's a very long string
- This one is safe to use in your frontend

#### **service_role key**
- Also starts with: `eyJ...`
- Also very long
- Has a ⚠️ warning next to it
- This one has admin privileges

---

## What to Do

**Copy both keys and share them with me:**

1. Click the **copy button** next to "anon public" key
2. Paste it here and say "anon key: [paste]"
3. Click the **copy button** next to "service_role" key
4. Paste it here and say "service key: [paste]"

**Example format:**
```
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Why I Need Both

- **anon key**: Your React app uses this to connect to Supabase
- **service_role key**: Edge functions use this for admin operations

Both are needed for the social media integration to work!

---

## Is It Safe?

Yes, because:
- ✅ .env file is in .gitignore (won't be committed to Git)
- ✅ These keys will stay on your local machine
- ✅ I'm adding them directly to .env for you
- ✅ This is a private conversation

**Just don't share them publicly on forums or social media!**

---

## 📋 Progress Check

What we have so far:
- ✅ Supabase Project URL
- ✅ Facebook App ID
- ✅ Facebook App Secret
- ✅ Facebook Page created
- ⏳ Supabase anon key (need this)
- ⏳ Supabase service_role key (need this)

Once I have these two keys, we can:
1. Run the database SQL
2. Deploy edge functions
3. Test your first real post! 🚀

---

**Click the link above and copy both keys for me!** 👆
