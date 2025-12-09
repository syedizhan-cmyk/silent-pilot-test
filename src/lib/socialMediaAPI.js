// Social Media API Integration
// Real API calls to post content to social platforms

import { supabase } from './supabase';

/**
 * Post content to a social media platform
 * This uses Supabase Edge Functions to securely make API calls with stored tokens
 */
export async function postToSocialMedia(accountId, content, options = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('social-post', {
      body: {
        accountId,
        content,
        mediaUrls: options.mediaUrls || [],
        scheduledTime: options.scheduledTime || null,
        additionalOptions: options,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to post to social media');
    }

    return {
      success: true,
      postId: data.postId,
      platform: data.platform,
      url: data.url,
      error: null,
    };
  } catch (error) {
    console.error('Social media post error:', error);
    return {
      success: false,
      postId: null,
      platform: null,
      url: null,
      error: error.message,
    };
  }
}

/**
 * Post to multiple platforms at once
 */
export async function postToMultiplePlatforms(accountIds, content, options = {}) {
  const results = await Promise.allSettled(
    accountIds.map(accountId => postToSocialMedia(accountId, content, options))
  );

  return results.map((result, index) => ({
    accountId: accountIds[index],
    ...(result.status === 'fulfilled' ? result.value : { success: false, error: result.reason?.message })
  }));
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(accountId) {
  try {
    const { data, error } = await supabase.functions.invoke('oauth-refresh', {
      body: { accountId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to refresh token');
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Token refresh error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a post from a social platform
 */
export async function deletePost(accountId, postId) {
  try {
    const { data, error } = await supabase.functions.invoke('social-delete', {
      body: { accountId, postId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to delete post');
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Delete post error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get analytics for a post
 */
export async function getPostAnalytics(accountId, postId) {
  try {
    const { data, error } = await supabase.functions.invoke('social-analytics', {
      body: { accountId, postId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to fetch analytics');
    }

    return {
      success: true,
      analytics: data,
      error: null,
    };
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return {
      success: false,
      analytics: null,
      error: error.message,
    };
  }
}

/**
 * Validate that a social media account is still connected and has valid tokens
 */
export async function validateAccount(accountId) {
  try {
    const { data, error } = await supabase.functions.invoke('social-validate', {
      body: { accountId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to validate account');
    }

    return {
      valid: data.valid,
      needsReauth: data.needsReauth,
      error: null,
    };
  } catch (error) {
    console.error('Account validation error:', error);
    return {
      valid: false,
      needsReauth: true,
      error: error.message,
    };
  }
}
