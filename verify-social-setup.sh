#!/bin/bash
# Social Media Integration Verification Script

echo "=================================="
echo "Social Media Integration Verification"
echo "=================================="
echo ""

# Check Edge Functions exist
echo "✓ Checking Edge Functions..."
FUNCTIONS=(
  "twitter-auth"
  "facebook-auth"
  "instagram-auth"
  "linkedin-auth"
  "tiktok-auth"
  "youtube-auth"
  "oauth-callback"
  "oauth-exchange"
)

MISSING_FUNCTIONS=0
for func in "${FUNCTIONS[@]}"; do
  if [ -f "supabase/functions/$func/index.ts" ]; then
    echo "  ✅ $func/index.ts"
  else
    echo "  ❌ $func/index.ts MISSING"
    MISSING_FUNCTIONS=$((MISSING_FUNCTIONS + 1))
  fi
done

echo ""

# Check frontend files
echo "✓ Checking Frontend Files..."
FRONTEND_FILES=(
  "src/lib/socialAuth.js"
  "src/pages/SocialConnect.js"
  "src/pages/OAuthCallback.js"
  "src/store/socialStore.js"
  "src/lib/socialMediaAPI.js"
)

MISSING_FRONTEND=0
for file in "${FRONTEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file MISSING"
    MISSING_FRONTEND=$((MISSING_FRONTEND + 1))
  fi
done

echo ""

# Check documentation
echo "✓ Checking Documentation..."
DOCS=(
  ".env.example"
  "SOCIAL_MEDIA_SETUP.md"
  "SOCIAL_OAUTH_QUICK_START.md"
  "SOCIAL_MEDIA_IMPLEMENTATION_SUMMARY.md"
)

MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "  ✅ $doc"
  else
    echo "  ❌ $doc MISSING"
    MISSING_DOCS=$((MISSING_DOCS + 1))
  fi
done

echo ""

# Check .env.example for required variables
echo "✓ Checking .env.example configuration..."
ENV_VARS=(
  "REACT_APP_FACEBOOK_APP_ID"
  "REACT_APP_TWITTER_CLIENT_ID"
  "REACT_APP_LINKEDIN_CLIENT_ID"
  "REACT_APP_TIKTOK_CLIENT_KEY"
  "REACT_APP_GOOGLE_CLIENT_ID"
)

MISSING_ENV=0
for var in "${ENV_VARS[@]}"; do
  if grep -q "$var" .env.example; then
    echo "  ✅ $var"
  else
    echo "  ❌ $var MISSING"
    MISSING_ENV=$((MISSING_ENV + 1))
  fi
done

echo ""

# Summary
echo "=================================="
echo "Summary"
echo "=================================="
TOTAL_MISSING=$((MISSING_FUNCTIONS + MISSING_FRONTEND + MISSING_DOCS + MISSING_ENV))

if [ $TOTAL_MISSING -eq 0 ]; then
  echo "✅ All files present and configured!"
  echo ""
  echo "Next Steps:"
  echo "1. Review SOCIAL_OAUTH_QUICK_START.md for setup"
  echo "2. Test demo mode: npm start"
  echo "3. Configure OAuth for production"
  echo "4. Deploy Edge Functions: supabase functions deploy"
else
  echo "⚠️  $TOTAL_MISSING issue(s) found:"
  [ $MISSING_FUNCTIONS -gt 0 ] && echo "  - $MISSING_FUNCTIONS Edge Function(s) missing"
  [ $MISSING_FRONTEND -gt 0 ] && echo "  - $MISSING_FRONTEND Frontend file(s) missing"
  [ $MISSING_DOCS -gt 0 ] && echo "  - $MISSING_DOCS Documentation file(s) missing"
  [ $MISSING_ENV -gt 0 ] && echo "  - $MISSING_ENV Environment variable(s) missing"
fi

echo ""
