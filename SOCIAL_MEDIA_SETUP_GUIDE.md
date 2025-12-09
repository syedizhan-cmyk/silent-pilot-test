# Social Media Integration Setup Guide

This guide will help you set up real social media authentication and posting for Silent Pilot.

## Prerequisites

You need to create developer accounts and apps for each social platform you want to integrate.

---

## 1. Facebook & Instagram (Meta Platform)

### Create a Meta App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details and create the app

### Configure OAuth

1. In your app dashboard, go to "Settings" → "Basic"
2. Copy your **App ID** and **App Secret**
3. Add to `.env`:
   ```
   REACT_APP_FACEBOOK_APP_ID=your_app_id_here
   REACT_APP_FACEBOOK_APP_SECRET=your_app_secret_here
   ```

4. Add OAuth Redirect URIs:
   - Development: `http://localhost:3000/oauth/callback`
   - Production: `https://yourdomain.com/oauth/callback`

5. Add Products:
   - **Facebook Login**: For authentication
   - **Instagram Basic Display**: For Instagram access
   - **Instagram Graph API**: For Instagram posting (requires business account)

### Required Permissions

- Facebook: `pages_manage_posts`, `pages_read_engagement`, `publish_to_groups`
- Instagram: `instagram_basic`, `instagram_content_publish`

### Notes

- Instagram posting requires a Business or Creator account
- Instagram must be linked to a Facebook Page
- You'll need to go through App Review for production use

---

## 2. Twitter/X (OAuth 2.0)

### Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Sign up for a developer account
3. Create a new project and app

### Configure OAuth 2.0

1. In your app settings, enable "OAuth 2.0"
2. Set the Type of App to "Web App"
3. Copy your **Client ID** and **Client Secret**
4. Add to `.env`:
   ```
   REACT_APP_TWITTER_CLIENT_ID=your_client_id_here
   REACT_APP_TWITTER_CLIENT_SECRET=your_client_secret_here
   ```

5. Add Callback URLs:
   - Development: `http://localhost:3000/oauth/callback`
   - Production: `https://yourdomain.com/oauth/callback`

### Required Scopes

- `tweet.read`, `tweet.write`, `users.read`, `offline.access`

### API Access Levels

- **Free**: Basic posting (limited)
- **Basic ($100/month)**: 10,000 tweets/month
- **Pro ($5,000/month)**: Unlimited tweets

---

## 3. LinkedIn (OAuth 2.0)

### Create a LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click "Create App"
3. Fill in required information

### Configure OAuth

1. In your app settings, go to "Auth" tab
2. Copy your **Client ID** and **Client Secret**
3. Add to `.env`:
   ```
   REACT_APP_LINKEDIN_CLIENT_ID=your_client_id_here
   REACT_APP_LINKEDIN_CLIENT_SECRET=your_client_secret_here
   ```

4. Add Redirect URLs:
   - `http://localhost:3000/oauth/callback`
   - `https://yourdomain.com/oauth/callback`

### Required Products

- Sign In with LinkedIn
- Share on LinkedIn
- Marketing Developer Platform (for company pages)

### Required Scopes

- `r_liteprofile`, `r_emailaddress`, `w_member_social`, `w_organization_social`

---

## 4. TikTok (OAuth)

### Create a TikTok Developer Account

1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Register as a developer
3. Create a new app

### Configure OAuth

1. In your app dashboard, get your **Client Key** and **Client Secret**
2. Add to `.env`:
   ```
   REACT_APP_TIKTOK_CLIENT_KEY=your_client_key_here
   REACT_APP_TIKTOK_CLIENT_SECRET=your_client_secret_here
   ```

3. Configure redirect URI:
   - Development: `http://localhost:3000/oauth/callback`
   - Production: `https://yourdomain.com/oauth/callback`

### Required Scopes

- `user.info.basic`, `video.upload`, `video.publish`

### Notes

- TikTok API access requires approval
- Content Creator API is needed for posting
- Some features may require business verification

---

## 5. YouTube (Google OAuth)

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3

### Configure OAuth

1. Go to "APIs & Services" → "Credentials"
2. Create "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Copy your **Client ID** and **Client Secret**
5. Add to `.env`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
   REACT_APP_GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

6. Add Authorized Redirect URIs:
   - `http://localhost:3000/oauth/callback`
   - `https://yourdomain.com/oauth/callback`

### Required Scopes

- `https://www.googleapis.com/auth/youtube.upload`
- `https://www.googleapis.com/auth/youtube.force-ssl`

---

## Deployment Configuration

### Supabase Edge Functions

For secure token handling, you'll need to set environment variables in Supabase:

```bash
# Set secrets for each platform
supabase secrets set FACEBOOK_APP_ID=your_app_id
supabase secrets set FACEBOOK_APP_SECRET=your_secret
supabase secrets set TWITTER_CLIENT_ID=your_client_id
supabase secrets set TWITTER_CLIENT_SECRET=your_secret
supabase secrets set LINKEDIN_CLIENT_ID=your_client_id
supabase secrets set LINKEDIN_CLIENT_SECRET=your_secret
supabase secrets set TIKTOK_CLIENT_KEY=your_key
supabase secrets set TIKTOK_CLIENT_SECRET=your_secret
supabase secrets set GOOGLE_CLIENT_ID=your_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=your_secret
supabase secrets set REDIRECT_URI=https://yourdomain.com/oauth/callback
```

### Vercel Environment Variables

If deploying to Vercel, add all `REACT_APP_*` variables in your project settings.

---

## Testing

1. Start your development server: `npm start`
2. Go to "Social Connect" page
3. Click "Connect" on any platform
4. Complete OAuth flow
5. Verify connection appears in your dashboard

---

## Troubleshooting

### "Invalid Redirect URI"
- Make sure redirect URIs match exactly in both your app config and `.env`
- Include protocol (http/https)
- Don't include trailing slashes

### "Insufficient Permissions"
- Review required scopes for each platform
- Some permissions require app review/approval

### "Token Expired"
- Tokens have expiration times
- Implement token refresh (included in our implementation)

### "API Rate Limits"
- Each platform has different rate limits
- Implement exponential backoff for retries
- Consider queueing posts for high-volume scenarios

---

## Security Best Practices

1. **Never commit secrets to git** - Use `.env` files (already in `.gitignore`)
2. **Use backend edge functions** - Don't expose client secrets in frontend
3. **Validate redirect URIs** - Prevent OAuth hijacking
4. **Implement CSRF protection** - Use state parameter in OAuth
5. **Rotate tokens regularly** - Implement token refresh flows
6. **Monitor API usage** - Set up alerts for unusual activity

---

## Cost Considerations

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Facebook/Instagram | Yes | Enterprise pricing |
| Twitter/X | Limited (1,500 posts/month) | $100-$5,000/month |
| LinkedIn | Yes | $0 for basic posting |
| TikTok | Approval required | Free after approval |
| YouTube | Yes (10,000 quota/day) | Additional quota available |

---

## Next Steps

After setting up authentication:

1. Test posting to each platform
2. Monitor API rate limits
3. Implement error handling and retries
4. Set up webhook listeners for engagement data
5. Consider implementing analytics tracking

For support, refer to each platform's developer documentation or community forums.
