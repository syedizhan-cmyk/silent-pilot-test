# Social Pilot Mobile App - Development Guide 📱

## Overview

This guide will help you create a mobile version of Social Pilot using **Expo** (React Native framework).

## Why Expo?

✅ **Completely FREE** to develop
✅ Build iOS and Android from same codebase
✅ Easy testing on your phone
✅ Simple deployment process
✅ Reuse your existing React knowledge

## Costs Breakdown

### Development Phase (FREE):
- ✅ Expo framework: **FREE**
- ✅ Development tools: **FREE**
- ✅ Testing on simulator: **FREE**
- ✅ Testing on your device: **FREE**
- ✅ Building the app: **FREE**

### Publishing Phase (Required Fees):
- 📱 **Apple App Store**: $99/year (Apple's fee)
- 🤖 **Google Play Store**: $25 one-time (Google's fee)

## Prerequisites

Before starting, you need:

1. **Node.js** (already installed ✅)
2. **Expo CLI** - Install with:
   ```bash
   npm install -g expo-cli
   ```
3. **Expo Go App** - Download on your phone:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Step-by-Step Setup

### Step 1: Create Expo Project

Run this on your local machine (not in this workspace):

```bash
# Navigate to your projects folder
cd ~/projects

# Create new Expo app
npx create-expo-app social-pilot-mobile

# Navigate into project
cd social-pilot-mobile

# Start the app
npm start
```

### Step 2: Install Required Packages

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Dependencies
npm install react-native-screens react-native-safe-area-context

# Expo packages
npm install expo-secure-store expo-image-picker expo-notifications

# Storage
npm install @react-native-async-storage/async-storage

# HTTP requests
npm install axios

# Forms
npm install formik yup
```

### Step 3: Project Structure

Create this folder structure:

```
social-pilot-mobile/
├── App.js                 # Main entry point
├── app.json              # Expo configuration
├── package.json
├── src/
│   ├── screens/          # All app screens
│   │   ├── AuthScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── CreatePostScreen.js
│   │   ├── CalendarScreen.js
│   │   ├── AnalyticsScreen.js
│   │   └── SettingsScreen.js
│   ├── components/       # Reusable components
│   │   ├── PostCard.js
│   │   ├── StatCard.js
│   │   └── CustomButton.js
│   ├── navigation/       # Navigation setup
│   │   ├── AppNavigator.js
│   │   └── TabNavigator.js
│   ├── services/         # API calls
│   │   ├── supabase.js
│   │   └── api.js
│   ├── context/          # State management
│   │   ├── AuthContext.js
│   │   └── ThemeContext.js
│   └── utils/           # Helper functions
│       └── constants.js
```

## Features to Implement

### Phase 1: Core Features (MVP)
- ✅ Authentication (Login/Signup)
- ✅ Dashboard with stats
- ✅ Create & schedule posts
- ✅ View upcoming posts
- ✅ Basic analytics
- ✅ Settings & profile

### Phase 2: Advanced Features
- ✅ Push notifications for scheduled posts
- ✅ Image picker from gallery
- ✅ Camera integration
- ✅ Offline mode with AsyncStorage
- ✅ Dark/Light theme toggle
- ✅ Social media account connections

### Phase 3: Pro Features
- ✅ AI content generation
- ✅ Media studio
- ✅ Advanced analytics charts
- ✅ Calendar view
- ✅ Bulk scheduling

## Development Workflow

### 1. Test on Your Phone (Instant Preview)

```bash
# Start Expo
npm start

# Scan QR code with:
# - iPhone: Camera app
# - Android: Expo Go app
```

### 2. Test on Simulator (Optional)

```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android
```

### 3. Build for Testing

```bash
# Build for iOS (TestFlight)
expo build:ios

# Build for Android (APK)
expo build:android
```

## App Store Submission Process

### For iOS (Apple App Store):

1. **Create Apple Developer Account** ($99/year)
   - Visit: https://developer.apple.com
   - Enroll in Apple Developer Program

2. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "Social Pilot",
       "slug": "social-pilot",
       "version": "1.0.0",
       "ios": {
         "bundleIdentifier": "com.yourcompany.socialpilot",
         "buildNumber": "1"
       }
     }
   }
   ```

3. **Build Production App**
   ```bash
   expo build:ios -t archive
   ```

4. **Submit via App Store Connect**
   - Upload build
   - Add screenshots, description
   - Submit for review (1-3 days)

### For Android (Google Play):

1. **Create Google Play Console Account** ($25 one-time)
   - Visit: https://play.google.com/console

2. **Build Production APK/AAB**
   ```bash
   expo build:android -t app-bundle
   ```

3. **Upload to Play Console**
   - Create app listing
   - Add screenshots, description
   - Submit for review (1-2 days)

## Monetization Options (Optional)

If you want to add in-app purchases or subscriptions:

- **Free to develop**
- Apple takes 30% of revenue (15% for subscriptions after 1 year)
- Google takes 30% of revenue (15% for subscriptions after 1 year)

## Timeline Estimate

- **Setup & Basic Structure**: 1-2 days
- **Core Features (Phase 1)**: 1-2 weeks
- **Advanced Features (Phase 2)**: 2-3 weeks
- **Polish & Testing**: 1 week
- **App Store Submission**: 1-3 days review time

**Total**: 4-6 weeks for a complete mobile app

## Next Steps

1. **Install Expo CLI on your local machine**:
   ```bash
   npm install -g expo-cli
   ```

2. **Create the project**:
   ```bash
   npx create-expo-app social-pilot-mobile
   ```

3. **I'll provide you with**:
   - Complete mobile app code
   - Screen components
   - Navigation setup
   - API integration
   - Publishing checklist

## Cost Summary

### One-Time Costs:
- Google Play Developer Account: **$25**

### Recurring Costs:
- Apple Developer Account: **$99/year**

### Optional Costs:
- None required for basic app!

## Resources

- Expo Documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines
- Play Store Policies: https://play.google.com/about/developer-content-policy

---

**Ready to proceed?** Let me know and I'll create all the mobile app code files for you! 📱✨
