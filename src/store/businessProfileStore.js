import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useBusinessProfileStore = create((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  // Load business profile
  loadProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      set({ profile: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Create or update business profile
  saveProfile: async (userId, profileData) => {
    set({ loading: true, error: null });
    try {
      // Check if profile exists
      const { data: existing } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;
      if (existing) {
        // Update existing profile
        result = await supabase
          .from('business_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .select()
          .single();
      } else {
        // Insert new profile
        result = await supabase
          .from('business_profiles')
          .insert({
            user_id: userId,
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      set({ profile: result.data, loading: false });
      return { success: true, data: result.data };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },

  // Add product/service
  addProductService: async (userId, item) => {
    const profile = get().profile;
    const currentItems = profile?.products_services || [];
    
    const updatedItems = [...currentItems, {
      id: Date.now(),
      ...item,
      created_at: new Date().toISOString()
    }];

    return get().saveProfile(userId, {
      ...profile,
      products_services: updatedItems
    });
  },

  // Remove product/service
  removeProductService: async (userId, itemId) => {
    const profile = get().profile;
    const updatedItems = profile.products_services.filter(item => item.id !== itemId);

    return get().saveProfile(userId, {
      ...profile,
      products_services: updatedItems
    });
  },

  // Update target audience
  updateTargetAudience: async (userId, audience) => {
    const profile = get().profile;
    return get().saveProfile(userId, {
      ...profile,
      target_audience: audience
    });
  },

  // Update brand voice
  updateBrandVoice: async (userId, voice) => {
    const profile = get().profile;
    return get().saveProfile(userId, {
      ...profile,
      brand_voice: voice
    });
  },

  // Get personalized content context
  getContentContext: () => {
    const profile = get().profile;
    if (!profile) return '';

    const context = `
Business: ${profile.business_name || 'N/A'}
Industry: ${profile.industry || 'N/A'}
Description: ${profile.description || 'N/A'}

Products/Services:
${profile.products_services?.map(item => `- ${item.name}: ${item.description}`).join('\n') || 'None listed'}

Target Audience:
- Demographics: ${profile.target_audience?.demographics || 'N/A'}
- Pain Points: ${profile.target_audience?.pain_points?.join(', ') || 'N/A'}
- Interests: ${profile.target_audience?.interests?.join(', ') || 'N/A'}

Brand Voice:
- Tone: ${profile.brand_voice?.tone || 'Professional'}
- Style: ${profile.brand_voice?.style || 'Informative'}
- Keywords: ${profile.brand_voice?.keywords?.join(', ') || 'N/A'}

Values: ${profile.brand_values?.join(', ') || 'N/A'}
    `.trim();

    return context;
  }
}));