// Store for managing brand intelligence data
import { create } from 'zustand';
import { supabase } from './supabase';

export const useBrandIntelligenceStore = create((set, get) => ({
  enrichedData: null,
  loading: false,
  lastUpdated: null,
  error: null,

  // Load enriched data from database
  loadEnrichedData: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('brand_intelligence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "not found" error
        throw error;
      }

      if (data) {
        set({
          enrichedData: data.enriched_data,
          lastUpdated: data.updated_at,
          error: null
        });
      }

      return data;
    } catch (error) {
      console.error('Error loading enriched data:', error);
      set({ error: error.message });
      return null;
    }
  },

  // Save enriched data to database
  saveEnrichedData: async (userId, enrichedData) => {
    try {
      const { data, error } = await supabase
        .from('brand_intelligence')
        .upsert({
          user_id: userId,
          enriched_data: enrichedData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      set({
        enrichedData: enrichedData,
        lastUpdated: new Date().toISOString(),
        error: null
      });

      return data;
    } catch (error) {
      console.error('Error saving enriched data:', error);
      set({ error: error.message });
      throw error;
    }
  },

  // Check if data needs refresh (older than 7 days)
  needsRefresh: () => {
    const { lastUpdated } = get();
    if (!lastUpdated) return true;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return new Date(lastUpdated) < sevenDaysAgo;
  },

  // Clear enriched data
  clearEnrichedData: () => {
    set({ enrichedData: null, lastUpdated: null, error: null });
  },

  setLoading: (loading) => set({ loading }),
}));
