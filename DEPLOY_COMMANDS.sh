#!/bin/bash

# Supabase Deployment Commands
# Copy and paste these one by one into your terminal

echo "🚀 Supabase Deployment Script"
echo "=============================="
echo ""

# Step 1: Login to Supabase
echo "Step 1: Login to Supabase (will open browser)"
echo "Command: supabase login"
echo ""
supabase login

echo ""
echo "✅ Login complete!"
echo ""

# Step 2: Link project
echo "Step 2: Link your project"
echo "Command: supabase link --project-ref qzvqnhbslecjjwakusva"
echo ""
supabase link --project-ref qzvqnhbslecjjwakusva

echo ""
echo "✅ Project linked!"
echo ""

# Step 3: Set secrets
echo "Step 3: Setting secrets for edge functions..."
echo ""

supabase secrets set FACEBOOK_APP_ID=1482734112820631
supabase secrets set FACEBOOK_APP_SECRET=8a4f5161c32389e5eed68dba9efdfae2
supabase secrets set SUPABASE_URL=https://qzvqnhbslecjjwakusva.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dnFuaGJzbGVjamp3YWt1c3ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg2ODI3MCwiZXhwIjoyMDgwNDQ0MjcwfQ.jslTDAlJE5B0Ro1cnjYipF6r5Jl_q1QQG913MPhyucU

echo ""
echo "✅ All secrets set!"
echo ""

# Step 4: Deploy functions
echo "Step 4: Deploying edge functions..."
echo ""

supabase functions deploy oauth-exchange
supabase functions deploy social-post
supabase functions deploy oauth-refresh
supabase functions deploy social-validate

echo ""
echo "✅ All functions deployed!"
echo ""

# Step 5: Verify
echo "Step 5: Verifying deployment..."
echo ""
supabase functions list

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "Next: Restart your app with 'npm start' and test it!"
