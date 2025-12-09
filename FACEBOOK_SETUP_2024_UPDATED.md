# 🔵 Facebook OAuth Setup - Updated 2024 Interface

Facebook has updated their developer interface. Here's the current way to set it up:

## Step 1: Create Facebook Developer Account

1. Go to: **https://developers.facebook.com/**
2. Log in with your Facebook account
3. If first time: Click **"Get Started"** and accept terms

---

## Step 2: Create Your App

1. Click **"My Apps"** in top right
2. Click **"Create App"** button
3. Select use case: Choose **"Other"** or **"Business"**
4. Select app type: Choose **"Business"**
5. Fill in details:
   - **App Name**: `Silent Pilot` (or your choice)
   - **App Contact Email**: Your email
6. Click **"Create App"**
7. Complete security check if prompted

---

## Step 3: Get Your Credentials

1. You're now in your app dashboard
2. Look at the top - you'll see your **App ID** displayed
3. In the left sidebar, click **"App Settings"** → **"Basic"**
4. You'll see:
   - **App ID**: Copy this number
   - **App Secret**: Click **"Show"** button, enter your Facebook password, then copy
5. **SAVE THESE SOMEWHERE SAFE!**

---

## Step 4: Add Facebook Login (UPDATED METHOD)

### Option A: If You See "Add Products" Section

1. Look in the left sidebar for **"Add Products"** or **"Products"**
2. Find **"Facebook Login"** in the list
3. Click **"Set Up"** or **"Configure"**

### Option B: If You Don't See "Add Products" (NEW INTERFACE)

1. In the left sidebar, look for **"Use Cases"** or **"Products"**
2. Click on **"Authentication and account creation"**
3. Or find and click **"Facebook Login"** directly in the sidebar
4. If you don't see it, click **"+ Add Product"** button (might be at the bottom of sidebar)

### Option C: Direct Method (Works for Everyone)

1. Look at the left sidebar menu
2. Scroll down until you see **"Facebook Login"** 
3. If it's not there yet, look for a **"+ button"** or **"Add"** option
4. Click **"Facebook Login"** → **"Settings"**

### Option D: Use the Dashboard Shortcut

1. Go back to your app dashboard (click app name at top)
2. Scroll down to "Add products to your app"
3. Find "Facebook Login" card
4. Click "Set up"

---

## Step 5: Configure Facebook Login Settings

Once you've accessed Facebook Login Settings:

1. Find **"Valid OAuth Redirect URIs"** field
2. Add this URL:
   ```
   http://localhost:3000/oauth/callback
   ```
3. Click **"Save Changes"** at the bottom

**IMPORTANT**: 
- Must be exact: `http://localhost:3000/oauth/callback`
- No trailing slash
- Include `http://`

---

## Step 6: Configure App Settings

### A. Add Platform:

1. In left sidebar: **"App Settings"** → **"Basic"**
2. Scroll down to **"Add Platform"** button
3. Click it and choose **"Website"**
4. Enter Site URL: `http://localhost:3000`
5. Click **"Save Changes"**

### B. Make App Public (For Testing):

1. At the very top of the page, look for the toggle
2. It might say **"In Development"** or have a switch
3. You can leave it "In Development" for now - that's fine for testing
4. Development mode allows you to test with your own account

---

## Step 7: Request Permissions (Optional but Recommended)

If you see "Permissions and Features" or "App Review":

1. Go to **"App Review"** → **"Permissions and Features"**
2. Find and request these (they'll be in Development Mode initially):
   - `pages_manage_posts`
   - `pages_read_engagement`
3. These are auto-approved in Development Mode

**NOTE**: In Development Mode, only you and test users can use the app. That's perfect for testing!

---

## Step 8: Create a Facebook Page (REQUIRED!)

**You MUST have a Facebook Page to post to!**

1. Go to: **https://www.facebook.com/pages/create**
2. Choose page type: **"Business or Brand"**
3. Fill in:
   - **Page Name**: Your business/project name
   - **Category**: Choose any relevant category
4. Click **"Create Page"**
5. Skip adding photos/details for now

**Why?** The Facebook API posts to Pages, not personal profiles.

---

## Step 9: Add Your Credentials to Silent Pilot

1. Open your project's `.env` file
2. Find these lines:
   ```
   REACT_APP_FACEBOOK_APP_ID=
   REACT_APP_FACEBOOK_APP_SECRET=
   ```
3. Add your actual credentials:
   ```
   REACT_APP_FACEBOOK_APP_ID=1234567890123456
   REACT_APP_FACEBOOK_APP_SECRET=abc123def456ghi789...
   ```
4. Make sure there are NO spaces and NO quotes
5. Save the file

---

## Step 10: Verify Your Setup

Check that you have:
- ✅ App ID (a number like: 123456789012345)
- ✅ App Secret (long string like: abc123def456...)
- ✅ OAuth Redirect URI added: `http://localhost:3000/oauth/callback`
- ✅ Website platform added with URL: `http://localhost:3000`
- ✅ Facebook Page created
- ✅ Credentials added to .env file

---

## 🎯 Can't Find "Add Products"? Try These:

### Method 1: Look for These Menu Items
- "Use Cases"
- "Products" 
- "Facebook Login" (directly in sidebar)
- "Build Your App"

### Method 2: URL Direct Access
Once you're in your app, go directly to:
```
https://developers.facebook.com/apps/YOUR_APP_ID/fb-login/settings/
```
Replace `YOUR_APP_ID` with your actual App ID

### Method 3: Dashboard Cards
From your app dashboard, scroll down and look for product cards with "Set Up" buttons

### Method 4: Search in Settings
1. Look for a search box in the settings
2. Type "OAuth" or "Login"
3. It should find the Facebook Login settings

---

## 🔍 Updated Facebook Developer Console Layout (2024)

The new layout typically looks like this:

```
Top Bar: [App Name] [App ID] [Development Mode Toggle]

Left Sidebar:
├─ Dashboard
├─ Use Cases (or Products)
│  ├─ Authenticate and request data
│  └─ Facebook Login ← Configure this
├─ App Settings
│  ├─ Basic ← Get App ID/Secret here
│  └─ Advanced
├─ App Review
└─ [Other sections]
```

---

## ❓ Troubleshooting

### "I still can't find Facebook Login"

Try this:
1. Go to your app dashboard
2. Look at the URL - it should be like: `https://developers.facebook.com/apps/123456789/`
3. Manually go to: `https://developers.facebook.com/apps/YOUR_APP_ID/fb-login/settings/`
4. This directly opens Facebook Login settings

### "My app doesn't have Add Products section"

This is fine! Facebook may have auto-added products. Just look for:
- "Facebook Login" in the sidebar
- "Settings" under Facebook Login
- Add your OAuth redirect URI there

### "Where do I add the redirect URI?"

Once you find Facebook Login settings:
1. Look for a field labeled: "Valid OAuth Redirect URIs"
2. It might also be called "Allowed OAuth Redirect URIs"
3. Add: `http://localhost:3000/oauth/callback`
4. Save

---

## ✅ What You Need at the End

From Facebook:
```
App ID: [Your App ID]
App Secret: [Your App Secret]
OAuth Redirect URI: http://localhost:3000/oauth/callback (configured in Facebook)
Facebook Page: [Created]
```

In your .env:
```
REACT_APP_FACEBOOK_APP_ID=your_actual_app_id
REACT_APP_FACEBOOK_APP_SECRET=your_actual_app_secret
REACT_APP_REDIRECT_URI=http://localhost:3000/oauth/callback
```

---

## 🚀 Next Steps

Once you have the credentials in .env:

1. Continue with database setup (YOUR_TODO_LIST.md Task 3)
2. Deploy edge functions (YOUR_TODO_LIST.md Task 5)
3. Test the connection!

---

## 📸 Visual Guide

Since the interface may vary, here are the key things to look for:

**App Settings → Basic:**
- Shows App ID and App Secret
- Has "Add Platform" button
- Lists your app's basic configuration

**Facebook Login Settings:**
- Has field for OAuth Redirect URIs
- May be under "Products" or "Use Cases"
- Key field: "Valid OAuth Redirect URIs"

---

## 💡 Pro Tip

If you get really stuck:
1. Use the direct URL method with your App ID
2. Or start fresh with a new app
3. The important part is getting App ID, App Secret, and setting the redirect URI

---

**Once you have these three things, you're good to continue with the next steps!**

1. ✅ App ID in .env
2. ✅ App Secret in .env  
3. ✅ Redirect URI configured in Facebook

**Next:** Run the database SQL and deploy functions! (YOUR_TODO_LIST.md)
