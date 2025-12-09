# Deployment Steps - Vercel + Supabase + Edge Functions

When new features are added, here’s how to make sure they’re reflected everywhere.

Local Development
- If dependencies changed: run `npm install`
- If `.env` changed (keys): restart dev server `npm start`
- If SQL schema changed: re-run the SQL in Supabase SQL Editor
- If Edge Functions changed: redeploy functions with Supabase CLI (see below)

Vercel Frontend Deployment
1. Push your changes to GitHub (or your Vercel-connected repo branch)
2. Vercel will auto-build and deploy
3. In Vercel → Project Settings → Environment Variables, add:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
   - REACT_APP_OPENAI_API_KEY
4. Redeploy (Vercel → Deployments → Redeploy)

Supabase Edge Functions Deployment
1. Install and login to Supabase CLI
   ```bash
   supabase login
   supabase link --project-ref qzvqnhbslecjjwakusva
   ```
2. Set secrets for functions
   ```bash
   supabase secrets set SUPABASE_URL="https://qzvqnhbslecjjwakusva.supabase.co"
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<service_role key>"

   supabase secrets set LINKEDIN_CLIENT_ID="<linkedin client id>"
   supabase secrets set LINKEDIN_CLIENT_SECRET="<linkedin client secret>"
   supabase secrets set LINKEDIN_REDIRECT_URI="https://<your-domain>/api/linkedin/callback"
   ```
3. Deploy functions
   ```bash
   supabase functions deploy scheduler
   supabase functions deploy linkedin-auth
   supabase functions deploy linkedin-callback
   ```
4. (Optional) Create a cron schedule for the scheduler
   ```bash
   supabase functions schedule create publish-scheduler --cron "* * * * *" --function scheduler
   ```

After Every Change - Quick Checklist
- Frontend code → push to git → Vercel auto-deploys
- New env vars → add to Vercel → Redeploy
- DB schema changes → run SQL in Supabase
- Edge Function changes → `supabase functions deploy <name>`
- New dependencies → Vercel rebuilds automatically after push

Notes
- Seeing only “Success. No rows returned” after running SQL is normal when creating tables/indexes/policies.
- For OAuth, ensure your LinkedIn app redirect URI matches the function callback URL.
- Never expose Supabase service_role key in frontend; only inside Edge Functions.
