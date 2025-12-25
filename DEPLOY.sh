#!/bin/bash

# ============================================================================
# SUPABASE PERFORMANCE FIX - SIMPLE DEPLOYMENT
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║              🚀 SUPABASE PERFORMANCE FIX - EASY DEPLOY 🚀                  ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Get the directory where this script is
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if curl is available (for API calls)
if ! command -v curl &> /dev/null; then
    echo "❌ curl is required but not installed"
    echo "Install with: brew install curl"
    exit 1
fi

echo "Step 1: Enter your Supabase Project URL"
echo "Find it at: https://app.supabase.com/project/[YOUR_PROJECT]/settings/api"
echo ""
read -p "Enter your Supabase URL (https://xxxxx.supabase.co): " SUPABASE_URL

if [ -z "$SUPABASE_URL" ]; then
    echo "❌ URL is required"
    exit 1
fi

echo ""
echo "Step 2: Enter your Service Role Key"
echo "Find it at: https://app.supabase.com/project/[YOUR_PROJECT]/settings/api"
echo "Look for 'service_role' key (NOT anon key)"
echo ""
read -s -p "Paste your Service Role Key: " SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ Service Role Key is required"
    exit 1
fi

echo ""
echo "Step 3: Getting the SQL migration..."

# Read the migration file
MIGRATION_FILE="$SCRIPT_DIR/supabase/migrations/20251224_performance_optimization_fixed.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

MIGRATION_SQL=$(cat "$MIGRATION_FILE")

echo "✅ SQL migration loaded ($(wc -c < "$MIGRATION_FILE") bytes)"
echo ""

echo "Step 4: Connecting to Supabase..."
echo ""

# Extract project ID from URL
PROJECT_ID=$(echo "$SUPABASE_URL" | sed 's/https:\/\///g' | sed 's/\.supabase\.co//g')

# Try to execute using REST API
echo "Attempting to execute SQL via Supabase REST API..."
echo ""

# First, let's try to get the project details to verify connection
RESPONSE=$(curl -s -X POST \
  "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT version();"}' 2>&1)

# Check if we got an error about the endpoint not existing
if echo "$RESPONSE" | grep -q "404\|not found\|does not exist"; then
    echo "⚠️  REST API method not available, trying alternative..."
    echo ""
    
    # Alternative: Try direct psql connection via tunnel
    if command -v psql &> /dev/null; then
        echo "Attempting direct PostgreSQL connection..."
        
        # Try psql with explicit SSL
        PGPASSWORD="$SERVICE_ROLE_KEY" psql \
          -h "${PROJECT_ID}.db.supabase.co" \
          -U postgres \
          -p 5432 \
          -d postgres \
          -c "SELECT 1;" > /dev/null 2>&1
        
        if [ $? -eq 0 ]; then
            echo "✅ Connected successfully!"
            echo ""
            echo "Applying migration..."
            echo ""
            
            # Execute the migration
            if PGPASSWORD="$SERVICE_ROLE_KEY" psql \
              -h "${PROJECT_ID}.db.supabase.co" \
              -U postgres \
              -p 5432 \
              -d postgres \
              -f "$MIGRATION_FILE" > /tmp/deploy.log 2>&1; then
                
                echo "✅ Migration applied successfully!"
                echo ""
                echo "Verifying fixes..."
                echo ""
                
                # Verify RLS
                RLS_COUNT=$(PGPASSWORD="$SERVICE_ROLE_KEY" psql \
                  -h "${PROJECT_ID}.db.supabase.co" \
                  -U postgres \
                  -p 5432 \
                  -d postgres \
                  -t -c "SELECT COUNT(*) FROM pg_tables WHERE rowsecurity AND schemaname = 'public';" 2>/dev/null | tr -d ' ')
                
                echo "✅ Tables with RLS: $RLS_COUNT"
                
                # Verify policies
                POLICY_COUNT=$(PGPASSWORD="$SERVICE_ROLE_KEY" psql \
                  -h "${PROJECT_ID}.db.supabase.co" \
                  -U postgres \
                  -p 5432 \
                  -d postgres \
                  -t -c "SELECT COUNT(*) FROM pg_policies;" 2>/dev/null | tr -d ' ')
                
                echo "✅ Security policies: $POLICY_COUNT"
                
                # Verify indexes
                INDEX_COUNT=$(PGPASSWORD="$SERVICE_ROLE_KEY" psql \
                  -h "${PROJECT_ID}.db.supabase.co" \
                  -U postgres \
                  -p 5432 \
                  -d postgres \
                  -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT LIKE 'pg_toast_%';" 2>/dev/null | tr -d ' ')
                
                echo "✅ Performance indexes: $INDEX_COUNT"
                echo ""
                echo "╔════════════════════════════════════════════════════════════════════════════╗"
                echo "║                      ✅ DEPLOYMENT COMPLETE! ✅                           ║"
                echo "╚════════════════════════════════════════════════════════════════════════════╝"
                echo ""
                echo "🎉 Your Supabase database is now optimized!"
                echo ""
                echo "Next steps:"
                echo "  1. Test your application: http://localhost:3000"
                echo "  2. Check dashboard: https://app.supabase.com/project/$PROJECT_ID/issues"
                echo "  3. Expected: 95+ warnings → 0-5 warnings"
                echo "  4. Expected: 50-500x faster queries"
                echo ""
                
                exit 0
            else
                echo "❌ Migration failed"
                echo ""
                echo "Error details:"
                cat /tmp/deploy.log
                exit 1
            fi
        else
            echo "❌ Could not connect to database"
            echo ""
            echo "Troubleshooting:"
            echo "  1. Verify Service Role Key is correct"
            echo "  2. Check that database is not paused"
            echo "  3. Try manual deployment at:"
            echo "     https://app.supabase.com/project/$PROJECT_ID/sql/new"
            exit 1
        fi
    else
        echo "❌ psql not installed and REST API not available"
        echo ""
        echo "Please use manual deployment:"
        echo "  1. Go to: https://app.supabase.com/project/$PROJECT_ID/sql/new"
        echo "  2. Open: $MIGRATION_FILE"
        echo "  3. Copy all and paste into SQL editor"
        echo "  4. Click Run"
        exit 1
    fi
else
    echo "REST API response: $RESPONSE"
    echo ""
    echo "Note: Using manual deployment method"
    echo ""
    echo "Please use manual deployment:"
    echo "  1. Go to: https://app.supabase.com/project/$PROJECT_ID/sql/new"
    echo "  2. Open: $MIGRATION_FILE"
    echo "  3. Copy all and paste into SQL editor"
    echo "  4. Click Run"
fi

# Clean up
unset SERVICE_ROLE_KEY
unset SUPABASE_URL

