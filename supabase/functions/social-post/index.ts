// Social Media Posting Edge Function
// Posts content to social media platforms using stored access tokens

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { accountId, content, mediaUrls, scheduledTime, additionalOptions } = await req.json();

    if (!accountId || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get account from database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: account, error: accountError } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('is_active', true)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found or inactive');
    }

    // Check if token is expired and needs refresh
    if (account.expires_at && new Date(account.expires_at) < new Date()) {
      // Token expired - attempt refresh
      if (account.refresh_token) {
        await refreshToken(supabase, account);
        // Refetch account with new token
        const { data: refreshedAccount } = await supabase
          .from('social_accounts')
          .select('*')
          .eq('id', accountId)
          .single();
        account.access_token = refreshedAccount.access_token;
      } else {
        throw new Error('Access token expired. Please reconnect your account.');
      }
    }

    // Post to the appropriate platform
    let result;
    switch (account.platform) {
      case 'facebook':
        result = await postToFacebook(account, content, mediaUrls);
        break;
      case 'instagram':
        result = await postToInstagram(account, content, mediaUrls);
        break;
      case 'twitter':
        result = await postToTwitter(account, content, mediaUrls);
        break;
      case 'linkedin':
        result = await postToLinkedIn(account, content, mediaUrls);
        break;
      case 'tiktok':
        result = await postToTikTok(account, content, mediaUrls);
        break;
      case 'youtube':
        result = await postToYouTube(account, content, mediaUrls, additionalOptions);
        break;
      default:
        throw new Error(`Unsupported platform: ${account.platform}`);
    }

    // Log the post in database
    await supabase.from('social_posts').insert({
      user_id: account.user_id,
      account_id: accountId,
      platform: account.platform,
      content: content,
      media_urls: mediaUrls,
      post_id: result.postId,
      post_url: result.url,
      status: 'published',
      published_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        postId: result.postId,
        platform: account.platform,
        url: result.url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Social post error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Facebook posting
async function postToFacebook(account: any, content: string, mediaUrls: string[]) {
  // Get Facebook pages
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${account.access_token}`
  );
  
  if (!pagesResponse.ok) throw new Error('Failed to fetch Facebook pages');
  const pagesData = await pagesResponse.json();
  
  if (!pagesData.data || pagesData.data.length === 0) {
    throw new Error('No Facebook pages found. Please create a page first.');
  }

  const pageAccessToken = pagesData.data[0].access_token;
  const pageId = pagesData.data[0].id;

  // Post to page
  const postData: any = { message: content };
  
  if (mediaUrls && mediaUrls.length > 0) {
    postData.url = mediaUrls[0]; // Facebook will fetch and attach the image
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed?access_token=${pageAccessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook post failed: ${error}`);
  }

  const result = await response.json();
  return {
    postId: result.id,
    url: `https://facebook.com/${result.id}`,
  };
}

// Instagram posting
async function postToInstagram(account: any, content: string, mediaUrls: string[]) {
  if (!mediaUrls || mediaUrls.length === 0) {
    throw new Error('Instagram posts require at least one image');
  }

  // Get Instagram business account ID
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?access_token=${account.access_token}`
  );
  
  const pagesData = await pagesResponse.json();
  const pageId = pagesData.data[0].id;
  
  const igResponse = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${account.access_token}`
  );
  
  const igData = await igResponse.json();
  const igAccountId = igData.instagram_business_account?.id;
  
  if (!igAccountId) {
    throw new Error('No Instagram business account linked. Please link one in Facebook.');
  }

  // Create media container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/media`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: mediaUrls[0],
        caption: content,
        access_token: account.access_token,
      }),
    }
  );

  const containerData = await containerResponse.json();
  
  if (!containerResponse.ok) {
    throw new Error(`Instagram container creation failed: ${JSON.stringify(containerData)}`);
  }

  // Publish media
  const publishResponse = await fetch(
    `https://graph.facebook.com/v19.0/${igAccountId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: account.access_token,
      }),
    }
  );

  const publishData = await publishResponse.json();
  
  if (!publishResponse.ok) {
    throw new Error(`Instagram publish failed: ${JSON.stringify(publishData)}`);
  }

  return {
    postId: publishData.id,
    url: `https://instagram.com/p/${publishData.id}`,
  };
}

// Twitter/X posting
async function postToTwitter(account: any, content: string, mediaUrls: string[]) {
  const tweetData: any = { text: content };

  // Upload media if present
  if (mediaUrls && mediaUrls.length > 0) {
    // Note: Twitter v2 API requires media to be uploaded first
    // This is simplified - in production, you'd need to download and upload media
    console.warn('Twitter media upload not fully implemented in this example');
  }

  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweetData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter post failed: ${error}`);
  }

  const result = await response.json();
  return {
    postId: result.data.id,
    url: `https://twitter.com/user/status/${result.data.id}`,
  };
}

// LinkedIn posting
async function postToLinkedIn(account: any, content: string, mediaUrls: string[]) {
  // Get user URN
  const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
    headers: { 'Authorization': `Bearer ${account.access_token}` },
  });
  
  const profileData = await profileResponse.json();
  const author = `urn:li:person:${profileData.id}`;

  const postData: any = {
    author: author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: mediaUrls && mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${account.access_token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn post failed: ${error}`);
  }

  const result = await response.json();
  return {
    postId: result.id,
    url: `https://www.linkedin.com/feed/update/${result.id}`,
  };
}

// TikTok posting (placeholder - requires video upload)
async function postToTikTok(account: any, content: string, mediaUrls: string[]) {
  throw new Error('TikTok posting requires video content and is not yet implemented');
}

// YouTube posting (placeholder - requires video upload)
async function postToYouTube(account: any, content: string, mediaUrls: string[], options: any) {
  throw new Error('YouTube posting requires video content and is not yet implemented');
}

// Refresh access token
async function refreshToken(supabase: any, account: any) {
  // Implementation depends on platform
  // Each platform has different refresh token flows
  console.log('Token refresh needed for', account.platform);
  // This would call platform-specific refresh endpoints
}
