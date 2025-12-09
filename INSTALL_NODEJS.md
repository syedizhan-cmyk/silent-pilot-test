# 📦 How to Install Node.js

## ❌ Problem: Node.js Not Installed

You're getting npm errors because Node.js is not installed on your computer.

---

## ✅ Solution: Install Node.js

### Step 1: Download Node.js

**Go to:** https://nodejs.org/

**Download the LTS version** (Long Term Support)
- For Mac: Download the `.pkg` installer
- For Windows: Download the `.msi` installer
- For Linux: Use package manager or download

### Step 2: Install

**Mac:**
1. Double-click the downloaded `.pkg` file
2. Follow the installation wizard
3. Click "Continue" → "Install" → Enter password
4. Wait for installation to complete

**Windows:**
1. Double-click the downloaded `.msi` file
2. Follow the installation wizard
3. Accept license agreement
4. Keep default settings
5. Click "Install"

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Verify Installation

Open a NEW terminal/command prompt and run:

```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.x.x
10.x.x
```

### Step 4: Install Project Dependencies

**NOW you can run:**

```bash
# Navigate to your project folder
cd path/to/silent-pilot-clone

# Install dependencies
npm install

# Start the development server
npm start
```

---

## 🎯 Quick Summary

1. ❌ **Problem:** Node.js not installed
2. 🔗 **Go to:** https://nodejs.org/
3. ⬇️ **Download:** LTS version
4. ▶️ **Install:** Run the installer
5. 🔄 **Restart:** Terminal/command prompt
6. ✅ **Run:** `npm install` then `npm start`

---

## 🚀 Alternative: Use the Preview File

**Don't want to install Node.js right now?**

You can still see the complete website by opening:

```
preview-complete.html
```

Just double-click it or drag it into your browser!

This shows you:
- ✅ Complete landing page
- ✅ All 11 sections
- ✅ Working navigation
- ✅ Responsive design

**BUT** it doesn't include the dashboard pages (those require React).

---

## ⚠️ Common Issues

### Issue: "command not found" after installing

**Solution:** Close and reopen your terminal/command prompt

### Issue: Permission errors on Mac/Linux

**Solution:** 
```bash
# Don't use sudo with npm install
# If you get permission errors, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bash_profile
source ~/.bash_profile
```

### Issue: Old Node.js version

**Solution:** 
- Uninstall old version first
- Then install latest LTS from nodejs.org

---

## 💡 Why Node.js?

Node.js is needed to:
- ✅ Run the React development server
- ✅ Install project dependencies
- ✅ Build the production version
- ✅ Use the dashboard features

---

## 📞 Still Having Issues?

1. Make sure you downloaded from **nodejs.org** (official site)
2. Choose **LTS version** (not Current)
3. **Restart your computer** after installation
4. Open a **NEW** terminal window
5. Try `node --version` again

---

## ✅ Once Node.js is Installed

Run these commands:

```bash
# Check Node.js is installed
node --version
npm --version

# Install project dependencies (takes 1-2 minutes)
npm install

# Start the development server
npm start
```

Your browser will automatically open to: http://localhost:3000

**Then click "Get Started" to access the dashboard!** 🚀

---

**Need help?** The error was simply that Node.js wasn't installed. 
Once you install it from nodejs.org, everything will work! 😊
