# Silent Pilot Website - Emergency Recovery Guide
## How to recover your website from backup

---

## 🚨 BACKUP CREATED

Your complete website backup has been created at:
**Location**: `Desktop/silentpilot-full-backup-[TIMESTAMP].tar.gz`

**Contents**:
- All source code (src/ directory)
- All documentation files (150+ MD files)
- All SQL schemas
- Supabase edge functions
- Configuration files
- Package dependencies
- **Excludes**: node_modules (can be reinstalled), build files, temp files

---

## 📦 What's Included in This Backup

### 1. Complete Documentation Set
- `BACKUP_MANIFEST.md` - Complete file structure and system overview
- `BACKUP_CODE_SNAPSHOT.md` - Key code implementations
- `BACKUP_RECOVERY_GUIDE.md` - This file (recovery instructions)
- All 150+ existing documentation files

### 2. Source Code Archive
- Full `.tar.gz` backup on Desktop
- Compressed size: ~50-100MB (without node_modules)
- Includes all React components, pages, utilities, stores

### 3. Database Schemas
- All SQL files for recreating database
- Migration scripts
- Table definitions

### 4. Configuration Templates
- `.env.example` with all required API keys
- `package.json` with all dependencies
- Supabase configuration

---

## 🔄 Recovery Scenarios & Solutions

### Scenario 1: "I accidentally deleted some files"

**Quick Recovery**:
```bash
# Extract the backup
cd ~/Desktop
tar -xzf silentpilot-full-backup-[TIMESTAMP].tar.gz -C "Silent Pilot Website Recovered"

# Copy specific files back
cp "Silent Pilot Website Recovered/path/to/file" "Silent Pilot Website/path/to/file"
```

### Scenario 2: "I need to restore to a previous version"

**Full Restoration**:
```bash
# Backup current state first (just in case)
mv "Desktop/Silent Pilot Website" "Desktop/Silent Pilot Website OLD"

# Extract backup
cd ~/Desktop
mkdir "Silent Pilot Website"
tar -xzf silentpilot-full-backup-[TIMESTAMP].tar.gz -C "Silent Pilot Website"

# Reinstall dependencies
cd "Desktop/Silent Pilot Website"
npm install

# Copy your current .env file if you want to keep API keys
cp "../Silent Pilot Website OLD/.env" .env

# Start the application
npm start
```

### Scenario 3: "I changed Rovo API key and lost access to previous context"

**Recovery Without Rovo**:
```bash
# You have ALL the documentation locally:
cd "Desktop/Silent Pilot Website"

# Search for anything you need
grep -r "search term" *.md

# View specific documentation
cat FUNCTIONALITY_GUIDE.md
cat TROUBLESHOOTING.md
cat DEPLOYMENT.md

# All your code is there - open in any editor
code .  # VS Code
```

### Scenario 4: "I need to rebuild the database"

**Database Recovery**:
```bash
cd "Desktop/Silent Pilot Website"

# Run SQL files in this order:
# 1. Login to Supabase dashboard
# 2. Go to SQL Editor
# 3. Run these files in order:

# Copy contents and run:
cat SUPABASE_SQL_SETUP.sql
cat SOCIAL_MEDIA_INTEGRATION_SQL.sql
cat AUTOPILOT_SQL.sql
cat AD_CAMPAIGNS_SQL.sql
cat BUSINESS_PROFILE_SQL.sql
cat WEBSITE_CRAWLER_SQL.sql
```

### Scenario 5: "I need to start completely fresh on a new machine"

**Complete Fresh Installation**:
```bash
# 1. Install Node.js (if not installed)
# Download from: https://nodejs.org/

# 2. Extract backup
cd ~/Desktop
mkdir "Silent Pilot Website"
tar -xzf silentpilot-full-backup-[TIMESTAMP].tar.gz -C "Silent Pilot Website"
cd "Silent Pilot Website"

# 3. Install dependencies
npm install

# 4. Create .env file from template
cp .env.example .env

# 5. Edit .env and add your API keys
nano .env  # or use any text editor

# 6. Set up Supabase
# - Create new project at supabase.com
# - Run all SQL schemas (see Scenario 4)
# - Update .env with new Supabase URL and keys

# 7. Deploy edge functions
# Follow DEPLOY_EDGE_FUNCTIONS.md

# 8. Start development server
npm start

# 9. Build for production
npm run build
```

### Scenario 6: "I need to find specific functionality"

**Search & Find**:
```bash
cd "Desktop/Silent Pilot Website"

# Find where a function is defined
grep -r "functionName" src/

# Find all Twitter-related code
grep -r "twitter" src/ --include="*.js"

# Find in documentation
grep -r "keyword" *.md

# List all components
ls -la src/components/

# List all pages
ls -la src/pages/

# Find edge functions
ls -la supabase/functions/
```

---

## 📁 Key Files Reference (Quick Access)

### Critical Configuration
```bash
.env                          # Your API keys (NOT in backup - must recreate)
.env.example                  # Template showing what keys you need
package.json                  # All dependencies
src/lib/supabase.js          # Database connection
```

### Authentication
```bash
src/store/authStore.js       # Login/logout logic
src/pages/Login.js           # Login page
src/pages/Signup.js          # Registration page
```

### Social Media
```bash
src/lib/socialAuth.js        # OAuth connections
src/lib/socialMediaAPI.js    # Posting to platforms
src/pages/SocialConnect.js   # Connection management UI
```

### AI Features
```bash
src/lib/openai.js            # OpenAI integration
src/lib/gemini.js            # Google Gemini
src/lib/autoContentGenerator.js  # Auto generation engine
src/pages/AutoPilot.js       # AutoPilot UI
```

### Main Application
```bash
src/App.js                   # Main app component
src/pages/Dashboard.js       # Dashboard home
src/pages/Calendar.js        # Content calendar
src/pages/CreateContent.js   # Content creation
```

---

## 🔍 Finding Information Without Rovo

### Use Built-in Search Tools

**On Mac**:
```bash
# Spotlight search within folder
# 1. Open Finder
# 2. Navigate to "Silent Pilot Website"
# 3. Press Cmd+F to search
# 4. Search for filename or content

# Terminal search
cd "Desktop/Silent Pilot Website"
grep -r "what you're looking for" .
```

**Using VS Code** (Recommended):
```bash
# Open project in VS Code
code "Desktop/Silent Pilot Website"

# Press Cmd+Shift+F for global search
# Search across all files instantly
```

### Documentation Index

All documentation is in the root folder. Here are the most important:

**Start Here**:
- `README.md` - Project overview
- `START_HERE.txt` - Quick start
- `GETTING_STARTED.md` - Detailed setup

**Setup & Configuration**:
- `SETUP_GUIDE.md` - Complete setup process
- `API_KEYS_NEEDED.md` - List of all required keys
- `INSTALL_NODEJS.md` - Node installation
- `INSTALL_SUPABASE_CLI_MAC.md` - Supabase CLI setup

**Features & Usage**:
- `FUNCTIONALITY_GUIDE.md` - How to use all features
- `FEATURES.md` - Complete feature list
- `DASHBOARD_GUIDE.md` - Dashboard usage
- `CALENDAR_FUNCTIONALITY_FIXED.md` - Calendar features

**Social Media**:
- `SOCIAL_MEDIA_SETUP_GUIDE.md` - Complete social setup
- `TWITTER_SETUP_GUIDE.md` - Twitter/X setup
- `FACEBOOK_SETUP_2024_UPDATED.md` - Facebook setup
- `SOCIAL_MEDIA_INTEGRATION_SUMMARY.md` - Overview

**AI & Automation**:
- `AI_FEATURES_SETUP_GUIDE.md` - AI setup
- `AUTOPILOT_SETUP_GUIDE.md` - AutoPilot setup
- `AI_PILOT_INTERFACE_GUIDE.md` - Using AI features

**Troubleshooting**:
- `TROUBLESHOOTING.md` - Common problems
- `DEBUG_FACEBOOK_CONNECTION.md` - Facebook issues
- `TWITTER_TROUBLESHOOTING.md` - Twitter issues
- `FIX_OPENAI_QUOTA.md` - OpenAI quota issues

**Deployment**:
- `DEPLOYMENT.md` - Deployment guide
- `DEPLOY_COMMANDS.sh` - Deployment script
- `DEPLOYMENT_STEPS_VERCEL_SUPABASE.md` - Vercel + Supabase

---

## 💾 Creating Additional Backups

### Regular Backup Schedule (Recommended)

**Weekly Backup Script**:
```bash
#!/bin/bash
# Save this as backup.sh in your project folder

DATE=$(date +%Y%m%d-%H%M%S)
cd ~/Desktop
tar -czf "silentpilot-backup-${DATE}.tar.gz" \
  --exclude='node_modules' \
  --exclude='build' \
  --exclude='.temp' \
  "Silent Pilot Website"

echo "Backup created: silentpilot-backup-${DATE}.tar.gz"

# Optional: Keep only last 5 backups
ls -t silentpilot-backup-*.tar.gz | tail -n +6 | xargs rm -f
```

Make it executable and run weekly:
```bash
chmod +x backup.sh
./backup.sh
```

### Git Version Control (Highly Recommended)

**Initialize Git Repository**:
```bash
cd "Desktop/Silent Pilot Website"

# Initialize repository
git init

# Add .gitignore if not present
cat > .gitignore << 'EOF'
node_modules/
build/
.env
.env.local
.DS_Store
npm-debug.log*
.temp/
EOF

# Make first commit
git add .
git commit -m "Initial commit - full backup"

# Create GitHub/GitLab repository and push
git remote add origin YOUR_REPO_URL
git push -u origin main
```

**Regular Git Backups**:
```bash
# After making changes
git add .
git commit -m "Describe your changes"
git push
```

### Cloud Storage Backup

**Upload to Cloud**:
```bash
# Google Drive (using rclone or web interface)
# Dropbox (using client or web interface)
# iCloud (drag and drop)

# Or use rsync to external drive
rsync -av --exclude='node_modules' \
  "Desktop/Silent Pilot Website" \
  /Volumes/ExternalDrive/Backups/
```

---

## 🔐 Protecting Your .env File

**IMPORTANT**: The `.env` file contains all your API keys and is NOT included in the backup for security.

### Save Your .env Securely

**Option 1: Encrypted File**:
```bash
# Encrypt .env file
openssl enc -aes-256-cbc -salt \
  -in .env \
  -out .env.encrypted

# Store .env.encrypted in backup
# To decrypt later:
openssl enc -aes-256-cbc -d \
  -in .env.encrypted \
  -out .env
```

**Option 2: Password Manager**:
- Save all API keys in 1Password, LastPass, or similar
- Create a secure note titled "Silent Pilot API Keys"
- Store each key separately

**Option 3: Secure Cloud Storage**:
- Upload to encrypted cloud storage
- Use a service like Keybase, Tresorit, or similar
- Never store in plain text in regular cloud storage

### Recreating .env from Memory

If you lose your .env, you can recreate it:

```bash
# Copy template
cp .env.example .env

# Edit and fill in keys
nano .env
```

Retrieve keys from:
- Supabase: https://app.supabase.com → Project Settings → API
- OpenAI: https://platform.openai.com/api-keys
- Twitter: https://developer.twitter.com/en/portal/dashboard
- Facebook: https://developers.facebook.com/apps
- LinkedIn: https://www.linkedin.com/developers/apps
- Google: https://console.cloud.google.com/apis/credentials

---

## 📊 Backup Verification Checklist

Before relying on a backup, verify it's complete:

### Check Archive Integrity
```bash
# Test the archive can be extracted
tar -tzf silentpilot-full-backup-*.tar.gz | head -20

# Count files
tar -tzf silentpilot-full-backup-*.tar.gz | wc -l
# Should be 200+ files
```

### Verify Key Files Present
```bash
# Extract to temporary location
mkdir /tmp/backup-test
tar -xzf silentpilot-full-backup-*.tar.gz -C /tmp/backup-test

# Check critical files
cd /tmp/backup-test
ls -la package.json        # ✓ Should exist
ls -la src/App.js          # ✓ Should exist
ls -la src/lib/supabase.js # ✓ Should exist
ls -la SUPABASE_SQL_SETUP.sql # ✓ Should exist

# Cleanup
rm -rf /tmp/backup-test
```

---

## 🎯 Quick Recovery Command Reference

### Extract Backup
```bash
tar -xzf silentpilot-full-backup-[DATE].tar.gz -C "destination-folder"
```

### Install Dependencies
```bash
cd "Silent Pilot Website"
npm install
```

### Start Development
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Search for Code
```bash
grep -r "search term" src/
```

### Search Documentation
```bash
grep -r "keyword" *.md
```

### List All Backups
```bash
ls -lht ~/Desktop/silentpilot-backup-* | head -10
```

---

## 🆘 Emergency Contact Information

### If You Need Help

**Project Information**:
- Project Name: Silent Pilot Website
- Technology: React 18 + Supabase
- Owner: Syed Izhan Ahmed
- Atlassian: syedizhan.atlassian.net

**Resources**:
- All documentation is in the project folder
- Search any `.md` file for specific topics
- Use VS Code for easy navigation and search

**Getting Help Without Rovo**:
1. Search documentation files first
2. Use Google/Stack Overflow for specific errors
3. Check Supabase documentation: docs.supabase.com
4. Check React documentation: react.dev

---

## 📝 Recovery Log Template

When you perform a recovery, document it:

```
Date: [DATE]
Time: [TIME]
Reason for Recovery: [WHY]
Backup Used: [FILENAME]
Files Recovered: [LIST]
Result: [SUCCESS/FAILED]
Notes: [ANY ISSUES OR OBSERVATIONS]
```

---

## ✅ Final Checklist

Your backup is complete when you have:

- [x] `.tar.gz` archive on Desktop
- [x] `BACKUP_MANIFEST.md` in project folder
- [x] `BACKUP_CODE_SNAPSHOT.md` in project folder
- [x] `BACKUP_RECOVERY_GUIDE.md` (this file) in project folder
- [ ] `.env` file backed up separately (IMPORTANT!)
- [ ] Cloud backup created (recommended)
- [ ] Git repository initialized (recommended)
- [ ] Tested that backup extracts successfully

---

## 🎉 You're Protected!

Your Silent Pilot Website is now fully backed up and recoverable. Even if:
- You lose access to Rovo
- Files get accidentally deleted
- Your computer crashes
- You need to move to a new machine
- You want to revert to an earlier version

**Everything you need is saved locally in these files!**

---

**Last Updated**: 2025-01-XX  
**Backup Version**: 1.0  
**Next Recommended Backup**: Weekly

**Remember**: 
- Run `./backup.sh` weekly
- Keep `.env` separately and securely
- Test your backups occasionally
- Document any major changes
