import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAnalyticsStore = create((set) => ({
  analytics: [],
  loading: false,
  error: null,

  // Record analytics event
  recordAnalytics: async (userId, analyticsData) => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .insert([{
          user_id: userId,
          post_id: analyticsData.postId,
          platform: analyticsData.platform,
          metric_type: analyticsData.metricType,
          metric_value: analyticsData.metricValue,
          metadata: analyticsData.metadata || {},
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get analytics for user
  getAnalytics: async (userId, startDate, endDate) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

      if (startDate) {
        query = query.gte('recorded_at', startDate);
      }
      if (endDate) {
        query = query.lte('recorded_at', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ analytics: data || [], loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  // Get analytics summary
  getAnalyticsSummary: async (userId, timeRange = '30days') => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate start date based on range
      switch(timeRange) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', startDate.toISOString())
        .lte('recorded_at', endDate.toISOString());

      if (error) throw error;

      // Calculate summary metrics
      const summary = {
        totalImpressions: 0,
        totalClicks: 0,
        totalEngagement: 0,
        avgEngagementRate: 0,
        platformBreakdown: {},
      };

      data.forEach(item => {
        if (item.metric_type === 'impressions') {
          summary.totalImpressions += parseFloat(item.metric_value || 0);
        } else if (item.metric_type === 'clicks') {
          summary.totalClicks += parseFloat(item.metric_value || 0);
        } else if (item.metric_type === 'engagement') {
          summary.totalEngagement += parseFloat(item.metric_value || 0);
        }

        // Platform breakdown
        if (!summary.platformBreakdown[item.platform]) {
          summary.platformBreakdown[item.platform] = 0;
        }
        summary.platformBreakdown[item.platform] += parseFloat(item.metric_value || 0);
      });

      if (summary.totalImpressions > 0) {
        summary.avgEngagementRate = (summary.totalEngagement / summary.totalImpressions) * 100;
      }

      return { data: summary, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },
}));
