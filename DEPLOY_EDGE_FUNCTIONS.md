# Deploying Edge Functions to Supabase

This guide explains how to deploy the OAuth and social media posting edge functions to Supabase.

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Supabase project created
3. OAuth credentials from social platforms

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase dashboard URL.

## Step 4: Set Environment Secrets

Edge functions need access to OAuth credentials. Set them as secrets:

```bash
# Facebook/Instagram
supabase secrets set FACEBOOK_APP_ID=your_facebook_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_facebook_app_secret

# Twitter/X
supabase secrets set TWITTER_CLIENT_ID=your_twitter_client_id
supabase secrets set TWITTER_CLIENT_SECRET=your_twitter_client_secret

# LinkedIn
supabase secrets set LINKEDIN_CLIENT_ID=your_linkedin_client_id
supabase secrets set LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# TikTok
supabase secrets set TIKTOK_CLIENT_KEY=your_tiktok_client_key
supabase secrets set TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Google/YouTube
supabase secrets set GOOGLE_CLIENT_ID=your_google_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase (these are automatically set, but double-check)
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 5: Deploy Edge Functions

Deploy all functions at once:

```bash
supabase functions deploy oauth-exchange
supabase functions deploy social-post
supabase functions deploy oauth-refresh
supabase functions deploy social-validate
```

Or deploy all at once:

```bash
supabase functions deploy
```

## Step 6: Verify Deployment

Check that functions are deployed:

```bash
supabase functions list
```

## Step 7: Test the Functions

### Test OAuth Exchange

```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/oauth-exchange' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"platform":"facebook","code":"test","userId":"test","redirectUri":"http://localhost:3000/oauth/callback"}'
```

### Test Social Post

```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/social-post' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"accountId":"your-account-id","content":"Test post"}'
```

## Step 8: Update Your .env File

Update your React app's .env file with the edge function URLs (optional, they're auto-configured):

```
REACT_APP_SUPABASE_FUNCTIONS_URL=https://your-project-ref.supabase.co/functions/v1
```

## Troubleshooting

### View Function Logs

```bash
supabase functions logs oauth-exchange
supabase functions logs social-post
```

### Common Issues

1. **"Missing secrets"** - Make sure all required secrets are set
2. **CORS errors** - Edge functions include CORS headers, but check your Supabase CORS settings
3. **Token exchange fails** - Verify your OAuth redirect URIs match exactly
4. **Rate limiting** - Some platforms have rate limits, implement backoff logic

## Local Development

Test functions locally before deploying:

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve oauth-exchange --env-file .env.local

# In another terminal, test the function
curl -i --location --request POST 'http://localhost:54321/functions/v1/oauth-exchange' \
  --header 'Authorization: Bearer YOUR_LOCAL_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"platform":"facebook","code":"test","userId":"test"}'
```

## Security Best Practices

1. **Never commit secrets** - Always use `supabase secrets set`
2. **Use service role key only in edge functions** - Never expose it in frontend
3. **Validate all inputs** - Check user permissions before posting
4. **Rate limit** - Implement rate limiting to prevent abuse
5. **Monitor logs** - Regularly check function logs for errors

## Updating Functions

When you make changes to function code:

```bash
# Deploy specific function
supabase functions deploy oauth-exchange

# Or deploy all
supabase functions deploy
```

## Production Checklist

- [ ] All OAuth apps are in production mode (not development)
- [ ] All secrets are set in Supabase
- [ ] Redirect URIs include production domain
- [ ] Functions are deployed and tested
- [ ] Error logging is configured
- [ ] Rate limiting is implemented
- [ ] API keys are rotated regularly

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Deploy Docs](https://deno.com/deploy/docs)
- Platform-specific API documentation (see SOCIAL_MEDIA_SETUP_GUIDE.md)
