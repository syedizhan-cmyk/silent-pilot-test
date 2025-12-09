#!/bin/bash

echo "🚀 Silent Pilot - Social Media Setup Helper"
echo "=========================================="
echo ""

# Check .env
echo "1️⃣ Checking .env configuration..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    if grep -q "REACT_APP_FACEBOOK_APP_ID=" .env; then
        if grep -q "REACT_APP_FACEBOOK_APP_ID=$" .env || grep -q "REACT_APP_FACEBOOK_APP_ID=\"\"" .env; then
            echo "⚠️  REACT_APP_FACEBOOK_APP_ID is empty - Add your Facebook App ID"
        else
            echo "✅ Facebook App ID is set"
        fi
    fi
else
    echo "❌ .env file not found"
fi
echo ""

# Check Supabase CLI
echo "2️⃣ Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI installed: $(supabase --version)"
else
    echo "❌ Supabase CLI not installed"
    echo "   Install with: npm install -g supabase"
fi
echo ""

# Check if functions exist
echo "3️⃣ Checking Edge Functions..."
for func in oauth-exchange social-post oauth-refresh social-validate; do
    if [ -f "supabase/functions/$func/index.ts" ]; then
        echo "✅ $func function exists"
    else
        echo "❌ $func function missing"
    fi
done
echo ""

# Check Node modules
echo "4️⃣ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Node modules installed"
else
    echo "⚠️  Node modules not installed - Run: npm install"
fi
echo ""

echo "=========================================="
echo "📋 Next Steps:"
echo ""
echo "1. Get Facebook OAuth credentials"
echo "   → https://developers.facebook.com/"
echo ""
echo "2. Add to .env file"
echo "   → REACT_APP_FACEBOOK_APP_ID=your_app_id"
echo ""
echo "3. Run SQL in Supabase"
echo "   → Copy SOCIAL_MEDIA_INTEGRATION_SQL.sql"
echo ""
echo "4. Deploy functions"
echo "   → supabase login"
echo "   → supabase link --project-ref YOUR_REF"
echo "   → supabase functions deploy"
echo ""
echo "5. Test it!"
echo "   → npm start"
echo ""
echo "📖 Full guide: SETUP_CHECKLIST_FOR_YOU.md"

