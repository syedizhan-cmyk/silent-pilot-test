import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useSocialStore = create((set, get) => ({
  connectedAccounts: [],
  loading: false,
  error: null,

  // Get connected social accounts
  getConnectedAccounts: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      set({ connectedAccounts: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  // Connect social account
  connectAccount: async (userId, accountData) => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .insert([{
          user_id: userId,
          platform: accountData.platform,
          account_name: accountData.accountName,
          account_id: accountData.accountId,
          access_token: accountData.accessToken,
          refresh_token: accountData.refreshToken,
          expires_at: accountData.expiresAt,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        connectedAccounts: [...state.connectedAccounts, data]
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Disconnect social account
  disconnectAccount: async (accountId) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ is_active: false })
        .eq('id', accountId);

      if (error) throw error;

      set((state) => ({
        connectedAccounts: state.connectedAccounts.filter(
          acc => acc.id !== accountId
        )
      }));

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Post to social media using real API integration
  postToSocial: async (accountId, content, mediaUrls = []) => {
    try {
      // Get account details
      const account = get().connectedAccounts.find(acc => acc.id === accountId);
      
      if (!account) {
        throw new Error('Account not found');
      }

      // Check if this is a demo account
      if (account.access_token && account.access_token.startsWith('demo_token_')) {
        console.log(`[DEMO MODE] Simulating post to ${account.platform}:`, content);
        return { 
          success: true, 
          postId: `demo_${account.platform}_${Date.now()}`,
          platform: account.platform,
          url: null,
          error: null,
          isDemo: true,
        };
      }

      // Use real API for actual connected accounts
      const { postToSocialMedia } = await import('../lib/socialMediaAPI');
      const result = await postToSocialMedia(accountId, content, { mediaUrls });
      
      return result;
    } catch (error) {
      console.error('Post to social error:', error);
      return { success: false, postId: null, error: error.message };
    }
  },

  // Post to multiple platforms at once
  postToMultiplePlatforms: async (accountIds, content, mediaUrls = []) => {
    try {
      const { postToMultiplePlatforms } = await import('../lib/socialMediaAPI');
      const results = await postToMultiplePlatforms(accountIds, content, { mediaUrls });
      return results;
    } catch (error) {
      console.error('Multi-platform post error:', error);
      return accountIds.map(id => ({ accountId: id, success: false, error: error.message }));
    }
  },

  // Refresh expired token
  refreshToken: async (accountId) => {
    try {
      const { refreshAccessToken } = await import('../lib/socialMediaAPI');
      const result = await refreshAccessToken(accountId);
      
      if (result.success) {
        // Reload connected accounts
        const userId = get().connectedAccounts.find(acc => acc.id === accountId)?.user_id;
        if (userId) {
          await get().getConnectedAccounts(userId);
        }
      }
      
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Validate account connection
  validateAccount: async (accountId) => {
    try {
      const { validateAccount } = await import('../lib/socialMediaAPI');
      return await validateAccount(accountId);
    } catch (error) {
      return { valid: false, needsReauth: true, error: error.message };
    }
  },
}));
