import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateContent } from '../lib/openai';
import { generateContentWithGemini } from '../lib/gemini';
import { generateContentWithHuggingFace, generateFallbackContent } from '../lib/huggingface';
import { generateContentWithCohere, generateWithMockAPI } from '../lib/cohere';
import { generateContentWithGroq } from '../lib/groq';
import { useBusinessProfileStore } from './businessProfileStore';

export const useContentStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  // Generate content with AI
  generateAIContent: async (prompt, platform) => {
    set({ loading: true, error: null });
    try {
      // Get business context for personalized content
      const businessContext = useBusinessProfileStore.getState().getContentContext();
      
      // Try multiple AI providers in order of preference
      let content;
      let provider = 'Unknown';
      
      // 1st Try: Gemini (Google's latest models 3.0/2.5)
      try {
        console.log('🚀 Trying Gemini AI (latest 3.0/2.5 models)...');
        content = await generateContentWithGemini(prompt, platform, businessContext);
        provider = 'Gemini AI';
        console.log('✅ Generated content using Gemini');
      } catch (geminiError) {
        console.log('Gemini failed, trying Groq...', geminiError.message);
        
        // 2nd Try: Groq AI (free LLaMA models)
        try {
          console.log('🚀 Trying Groq AI (free LLaMA models)...');
          content = await generateContentWithGroq(prompt, platform);
          provider = 'Groq AI (LLaMA)';
          console.log('✅ Generated content using Groq');
        } catch (groqError) {
          console.log('Groq failed, trying Cohere...', groqError.message);
          
          // 3rd Try: Cohere AI (backup)  
          try {
            console.log('🚀 Trying Cohere AI (backup)...');
            content = await generateContentWithCohere(prompt, platform);
            provider = 'Cohere AI';
            console.log('✅ Generated content using Cohere');
          } catch (cohereError) {
            console.log('All AI APIs failed, using Smart AI...', cohereError.message);
            
            // 4th Try: Smart AI fallback
            content = await generateWithMockAPI(prompt, platform);
            provider = 'Smart AI';
            console.log('✅ Generated content using Smart AI');
          }
        }
      }
      
      set({ loading: false });
      return { content: content, error: null };
    } catch (error) {
      console.error('❌ All AI generation methods failed:', error.message);
      set({ loading: false, error: error.message });
      return { content: null, error: error.message };
    }
  },

  // Save post to database
  savePost: async (userId, postData) => {
    try {
      const { data, error } = await supabase
        .from('scheduled_content')
        .insert([{
          user_id: userId,
          platform: postData.platform,
          content: postData.content,
          image_url: postData.mediaUrls?.[0] || null,
          scheduled_for: postData.scheduledFor,
          status: postData.status || 'draft',
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      set((state) => ({
        posts: [...state.posts, data]
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Error saving post:', error);
      return { data: null, error: error.message };
    }
  },

  // Get user's posts
  getPosts: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('scheduled_content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ posts: data, loading: false });
      return { data, error: null };
    } catch (error) {
      set({ loading: false, error: error.message });
      return { data: null, error: error.message };
    }
  },

  // Update post
  updatePost: async (postId, updates) => {
    try {
      const { data, error } = await supabase
        .from('scheduled_content')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        posts: state.posts.map(post => 
          post.id === postId ? data : post
        )
      }));

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const { error } = await supabase
        .from('scheduled_content')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Remove from local state
      set((state) => ({
        posts: state.posts.filter(post => post.id !== postId)
      }));

      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Schedule post
  schedulePost: async (postId, scheduledDate) => {
    return get().updatePost(postId, {
      scheduled_for: scheduledDate,
      status: 'scheduled'
    });
  },

  // Publish post immediately
  publishPost: async (postId) => {
    const updated = await get().updatePost(postId, {
      status: 'published',
      published_at: new Date().toISOString()
    });
    try {
      // record analytics event
      const { data: post } = await supabase.from('scheduled_content').select('*').eq('id', postId).single();
      if (post) {
        await supabase.from('analytics').insert([{
          user_id: post.user_id,
          post_id: post.id,
          platform: post.platform,
          metric_type: 'published',
          metric_value: 1,
          metadata: { source: 'manual' }
        }]);
      }
    } catch (e) {
      console.warn('Analytics record error:', e.message);
    }
    return updated;
  },
}));
