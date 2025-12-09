# Supabase Edge Functions - Scheduler and LinkedIn OAuth

This guide sets up:
- A cron-powered Scheduler to publish due posts
- LinkedIn OAuth (server-side) to connect accounts and post on behalf of users

Prerequisites
- Supabase CLI installed: https://supabase.com/docs/guides/cli
- Logged in and linked to your project
  ```bash
  supabase login
  supabase link --project-ref qzvqnhbslecjjwakusva
  ```

Folder Structure
```
/supabase
  /functions
    /scheduler
      index.ts
    /linkedin-auth
      index.ts
    /linkedin-callback
      index.ts
  config.toml
```

Setup Steps
1) Create functions (already scaffolded in this repo under supabase/functions)
2) Configure environment secrets for functions:

```bash
# Required by functions to talk to your database securely
supabase secrets set SUPABASE_URL="https://qzvqnhbslecjjwakusva.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="<your service_role key>"

# LinkedIn OAuth
supabase secrets set LINKEDIN_CLIENT_ID="<linkedin app client id>"
supabase secrets set LINKEDIN_CLIENT_SECRET="<linkedin app client secret>"
supabase secrets set LINKEDIN_REDIRECT_URI="https://<your-vercel-domain>/api/linkedin/callback" # or your Edge Function URL
```

Get your service role key from Supabase Dashboard → Settings → API. Never expose it in the frontend. It's safe inside Edge Functions.

3) Deploy functions
```bash
# from the repo root or supabase/ directory
supabase functions deploy scheduler
supabase functions deploy linkedin-auth
supabase functions deploy linkedin-callback
```

4) Set up cron for scheduler
Add a cron job using Supabase Scheduled Triggers (Beta) or your external scheduler.

- If using Scheduled Triggers (when available): schedule every minute:
```bash
supabase functions schedule create publish-scheduler \
  --cron "* * * * *" \
  --function scheduler
```

- Or use an external cron (e.g., GitHub Actions, GitHub Cron, UptimeRobot) hitting the function URL:
  https://<your-project-ref>.functions.supabase.co/scheduler

5) Configure OAuth app on LinkedIn
- Create a LinkedIn Developer App: https://www.linkedin.com/developers/apps
- Add OAuth 2.0 redirect URL to your Edge Function endpoint (e.g.)
  https://<your-project-ref>.functions.supabase.co/linkedin-callback
- Request permissions: w_member_social, r_liteprofile, r_emailaddress (adjust as needed)
- Copy Client ID/Secret to Supabase secrets above

6) Wire the frontend
- The Social Accounts page can open the auth function URL:
  https://<your-project-ref>.functions.supabase.co/linkedin-auth?user_id=<userId>
- After approval, the callback function stores the tokens to social_accounts table.

7) Test
- Connect LinkedIn in the app → should redirect to LinkedIn consent → back to callback → tokens saved
- Scheduler runs every minute and publishes due posts using stored tokens

Notes
- The scheduler and OAuth functions run server-side and use the service role key.
- Do NOT expose service role key in the frontend.
- You can extend these to support other platforms similarly.
