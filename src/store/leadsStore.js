import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useLeadsStore = create((set) => ({
  leads: [],
  loading: false,
  error: null,

  // Get all leads
  getLeads: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ leads: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  // Add new lead
  addLead: async (userId, leadData) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          user_id: userId,
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          status: leadData.status || 'cold',
          score: leadData.score || 0,
          source: leadData.source,
          notes: leadData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        leads: [data, ...state.leads]
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update lead
  updateLead: async (leadId, updates) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        leads: state.leads.map(lead => 
          lead.id === leadId ? data : lead
        )
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete lead
  deleteLead: async (leadId) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      set((state) => ({
        leads: state.leads.filter(lead => lead.id !== leadId)
      }));

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Update lead score
  updateLeadScore: async (leadId, score) => {
    return set.updateLead(leadId, { score });
  },

  // Update lead status
  updateLeadStatus: async (leadId, status) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        leads: state.leads.map(lead => 
          lead.id === leadId ? data : lead
        )
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
}));
