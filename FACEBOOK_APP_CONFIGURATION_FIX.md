# 🔧 Fix Facebook App Configuration

## The Error

"It looks like this app isn't available" or "This app needs at least one supported permission"

This means your Facebook app isn't properly configured with required products.

---

## ✅ COMPLETE SETUP GUIDE

### Step 1: Add Facebook Login Product

1. Go to: https://developers.facebook.com/apps/1482734112820631/
2. Look for **"Add Product"** section (on dashboard or in sidebar)
3. Find **"Facebook Login"**
4. Click **"Set Up"**
5. Choose **"Web"** platform when asked

### Step 2: Configure Facebook Login Settings

1. In left sidebar, click **"Facebook Login"** → **"Settings"**
2. Find **"Valid OAuth Redirect URIs"**
3. Add:
   ```
   http://localhost:3000/oauth/callback
   ```
4. Find **"Client OAuth Login"** - make sure it's **ON**
5. Find **"Web OAuth Login"** - make sure it's **ON**
6. Click **"Save Changes"**

### Step 3: Configure App Domains

1. Go to **"Settings"** → **"Basic"** in left sidebar
2. Scroll down to **"App Domains"**
3. Add:
   ```
   localhost
   ```
4. Scroll to **"Website"** section
5. Add **Site URL**:
   ```
   http://localhost:3000
   ```
6. Click **"Save Changes"**

### Step 4: Make Sure App is in Development Mode

1. At the top of the page, check the toggle
2. It should say **"In Development"** - that's good!
3. You can see **"App Mode: Development"**

### Step 5: Verify Permissions

1. Go to **"App Review"** → **"Permissions and Features"**
2. Find **"email"** permission
3. Should show as "Standard Access" or automatically approved for dev mode

---

## 🎯 ALTERNATIVE: Start Fresh with Guided Setup

If the above is confusing, try Facebook's wizard:

1. Go to your app dashboard
2. Look for **"Quickstart"** or **"Get Started"** button
3. Choose **"Web"** 
4. Follow the guided steps
5. When it asks for Site URL, use: `http://localhost:3000`

---

## 📋 Checklist - Verify These Settings

Go to your app and verify:

- [ ] "Facebook Login" appears in left sidebar
- [ ] Facebook Login Settings has redirect URI added
- [ ] Client OAuth Login is ON
- [ ] Web OAuth Login is ON
- [ ] App Domains includes "localhost"
- [ ] Website Site URL is set to http://localhost:3000
- [ ] App is in "Development" mode
- [ ] You're listed as Administrator

---

## 🔍 Visual Check

Your app dashboard should look like this:

**Left Sidebar Should Have:**
```
Dashboard
Settings
  ├─ Basic
  └─ Advanced
App Review
Facebook Login
  └─ Settings
Roles
```

If "Facebook Login" is missing, that's the problem!

---

## 💡 If Facebook Login Won't Add

Sometimes Facebook has UI issues. Try:

1. **Refresh the page** and try adding again
2. **Use different browser** (Chrome, Safari, Edge)
3. **Clear Facebook site cookies** and login again
4. **Try on mobile** - Facebook developer portal works on phone too

---

## 🚀 After Configuration

Once everything is set up:

1. **Restart your app:**
   ```bash
   cd ~/Desktop/Silent\ Pilot\ Website
   npm start
   ```

2. **Clear browser cache** (Cmd+Shift+Delete)

3. **Hard refresh** (Cmd+Shift+R)

4. **Try connecting Facebook** - should work now!

---

## 🆘 Still Not Working?

Take screenshots of:
1. Your app dashboard (left sidebar showing products)
2. Facebook Login Settings page
3. Settings → Basic page

This will help me debug further!

---

## ⚡ QUICK FIX TO TEST

Want to verify the OAuth flow works at all? Try this direct URL (paste in browser while app is running):

```
https://www.facebook.com/v19.0/dialog/oauth?client_id=1482734112820631&redirect_uri=http://localhost:3000/oauth/callback&scope=email&response_type=code&state=test
```

If this works, the issue is with how our code is calling it.
If this ALSO fails, it's the Facebook app configuration.

---

**Complete the steps above and let me know:**
1. Did you find "Facebook Login" in the sidebar?
2. If not, were you able to add it?
3. After adding it, does the connection work?
