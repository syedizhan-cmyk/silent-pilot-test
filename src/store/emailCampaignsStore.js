import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useEmailCampaignsStore = create((set) => ({
  campaigns: [],
  loading: false,
  error: null,

  getCampaigns: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ campaigns: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  addCampaign: async (userId, payload) => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .insert([{ user_id: userId, ...payload }])
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
      const { data, error } = await supabase
        .from('email_campaigns')
        .update(updates)
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
