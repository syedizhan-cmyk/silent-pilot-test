# 📝 How to Edit the .env File

## ✅ Good News!

1. **Redirect URI**: You DON'T need to add it! Facebook automatically allows localhost in development mode. ✅
2. **.env file**: I just created it for you! Your App ID is already in there. ✅

---

## 📂 Where is the .env File?

The `.env` file is in your **project root folder** (same folder as package.json).

**Note**: Files starting with a dot (`.`) are hidden by default on some systems.

---

## 🔍 How to Find and Open It

### Option 1: VS Code (Recommended)

1. Open VS Code with your project
2. Look at the file explorer on the left
3. Scroll to the top of the file list
4. Look for `.env` (starts with a dot)
5. Click to open it

**Can't see it?** 
- Make sure "Show Hidden Files" is enabled
- Or use View → Command Palette → Type "Open File" → Type `.env`

### Option 2: Other Code Editors

**Atom / Sublime / IntelliJ:**
- File → Open → Navigate to project folder
- Type `.env` in the filename box
- Or enable "Show Hidden Files" in your editor settings

### Option 3: Command Line

Open terminal in your project folder:

```bash
# Mac/Linux
nano .env

# Windows
notepad .env

# VS Code from terminal
code .env
```

### Option 4: File Explorer/Finder

**Windows:**
1. Open File Explorer to your project folder
2. View → Show → Hidden items (check the box)
3. Look for `.env` file
4. Right-click → Open with → Choose your text editor

**Mac:**
1. Open Finder to your project folder
2. Press `Cmd + Shift + .` (shows hidden files)
3. Find `.env` file
4. Right-click → Open With → TextEdit or VS Code

---

## 📝 What to Add to .env

Once you open the file, find this section:

```bash
# Facebook & Instagram (Meta Platform)
REACT_APP_FACEBOOK_APP_ID=1482734112820631
REACT_APP_FACEBOOK_APP_SECRET=
```

**Your App ID is already there!** ✅

Now add your **NEW** App Secret (after resetting it):

```bash
REACT_APP_FACEBOOK_APP_SECRET=your_new_secret_here
```

**Replace `your_new_secret_here` with your actual secret!**

---

## 🔐 Important: Get Your NEW Secret First

Before editing .env, reset your App Secret:

1. Go to: https://developers.facebook.com/apps/1482734112820631/settings/basic/
2. Click "Reset App Secret"
3. Copy the NEW secret
4. Then add it to .env

---

## ✅ Your .env Should Look Like This

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (if you have it)
REACT_APP_OPENAI_API_KEY=your_openai_api_key

# Facebook & Instagram
REACT_APP_FACEBOOK_APP_ID=1482734112820631
REACT_APP_FACEBOOK_APP_SECRET=abc123yoursecrethere456def

# OAuth Redirect URI
REACT_APP_REDIRECT_URI=http://localhost:3000/oauth/callback
```

---

## 🎯 Quick Checklist

- [ ] Reset App Secret in Facebook (get NEW one)
- [ ] Find and open .env file in your editor
- [ ] Add NEW App Secret to REACT_APP_FACEBOOK_APP_SECRET=
- [ ] Save the file
- [ ] Don't share the secret again!

---

## 🚨 Common Issues

### "I still can't find .env"

Try this command to verify it exists:
```bash
ls -la | grep .env
```

If it says "No such file", I can create it again.

### "My editor won't show hidden files"

**VS Code:** 
- Files → Preferences → Settings
- Search for "files.exclude"
- Make sure `.env` is not in the exclude list

**Or just use command line:**
```bash
code .env   # Opens in VS Code
nano .env   # Opens in terminal editor
```

### "I opened it but it's empty"

That's fine! Copy this template:

```bash
REACT_APP_FACEBOOK_APP_ID=1482734112820631
REACT_APP_FACEBOOK_APP_SECRET=your_new_secret_here
REACT_APP_REDIRECT_URI=http://localhost:3000/oauth/callback
REACT_APP_SUPABASE_URL=
REACT_APP_SUPABASE_ANON_KEY=
```

---

## 🎉 After You Add the Secret

Once your .env looks good:

1. ✅ App ID in .env
2. ✅ NEW App Secret in .env
3. ✅ Redirect URI (handled by Facebook automatically)

**Next Steps:**
1. Create a Facebook Page
2. Run database SQL in Supabase
3. Deploy edge functions
4. Test it!

---

## 💡 Pro Tip

The .env file is in your `.gitignore`, which means:
- ✅ It won't be committed to Git
- ✅ Your secrets stay private
- ✅ It's safe on your computer

**Just never share or screenshot the .env file!**

---

**Let me know once you've added the App Secret to .env!**
