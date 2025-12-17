import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useEmailCampaignsStore = create((set) => ({
  campaigns: [],
  loading: false,
  error: null,

  getCampaigns: async (userId) => {
    set({ loading: true });
    try {
      console.log('🔍 getCampaigns called for user:', userId);
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      console.log('📊 DB returned:', data?.length, 'campaigns', data);
      
      if (error) throw error;
      set({ campaigns: data || [], loading: false });
      
      console.log('✅ Store updated with', data?.length, 'campaigns');
      
      return { data, error: null };
    } catch (error) {
      console.error('❌ getCampaigns error:', error);
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  addCampaign: async (userId, payload) => {
    try {
      // Map 'body' to 'content' for database compatibility
      const dbPayload = {
        user_id: userId,
        ...payload,
        content: payload.body || payload.content || '',
      };
      delete dbPayload.body; // Remove body since we're using content
      
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert([dbPayload])
        .select()
        .single();
      if (error) throw error;
      set((state) => ({ campaigns: [data, ...state.campaigns] }));
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  updateCampaign: async (id, updates) => {
    try {
      // Map 'body' to 'content' for database compatibility
      const dbUpdates = { ...updates };
      if (dbUpdates.body) {
        dbUpdates.content = dbUpdates.body;
        delete dbUpdates.body;
      }
      
      const { data, error } = await supabase
        .from('email_campaigns')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? data : c)),
      }));
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  deleteCampaign: async (id) => {
    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set((state) => ({ campaigns: state.campaigns.filter((c) => c.id !== id) }));
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },
}));
