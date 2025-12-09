import { supabase } from '../lib/supabase';

// Polls for due scheduled posts and publishes them
export function startScheduler({ getConnectedAccounts, postToSocial }, user) {
  if (!user) return () => {};

  let timer = null;

  const tick = async () => {
    try {
      const nowIso = new Date().toISOString();
      // Find posts scheduled up to now that are not yet published
      const { data: duePosts, error } = await supabase
        .from('scheduled_content')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .lte('scheduled_for', nowIso)
        .limit(10);

      if (error) throw error;

      if (duePosts && duePosts.length) {
        // Ensure accounts loaded
        await getConnectedAccounts(user.id);

        for (const post of duePosts) {
          try {
            // Here you would route to the correct platform account
            // For now, just simulate posting via store
            await postToSocial(post.social_account_id || null, post.content, post.media_urls || []);
            // Mark as published
            await supabase
              .from('scheduled_content')
              .update({ status: 'published', published_at: new Date().toISOString() })
              .eq('id', post.id);
          } catch (e) {
            console.error('Publish error:', e);
          }
        }
      }
    } catch (e) {
      console.error('Scheduler tick error:', e);
    } finally {
      // schedule next tick
      timer = setTimeout(tick, 60000); // 60s
    }
  };

  // start immediately
  tick();

  return () => {
    if (timer) clearTimeout(timer);
  };
}
