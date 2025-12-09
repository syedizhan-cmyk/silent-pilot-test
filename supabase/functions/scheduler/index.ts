// Supabase Edge Function: scheduler
// Publishes due posts (status='scheduled' and scheduled_for <= now) and marks them 'published'
// Requires secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    };

    const nowIso = new Date().toISOString();

    // 1) Get due posts
    const dueRes = await fetch(`${SUPABASE_URL}/rest/v1/posts?status=eq.scheduled&scheduled_for=lte.${encodeURIComponent(nowIso)}`, {
      headers,
    });

    if (!dueRes.ok) {
      const msg = await dueRes.text();
      return new Response(`Error fetching due posts: ${msg}`, { status: 500 });
    }

    const duePosts = await dueRes.json();

    if (!Array.isArray(duePosts) || duePosts.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    let processed = 0;

    for (const post of duePosts) {
      try {
        // TODO: Use platform tokens from social_accounts to post to LinkedIn/Twitter/etc.
        // For now, just mark as published and record analytics

        const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${post.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'published', published_at: new Date().toISOString() })
        });

        if (!updateRes.ok) {
          console.log('Failed to update post', await updateRes.text());
          continue;
        }

        // Analytics record
        await fetch(`${SUPABASE_URL}/rest/v1/analytics`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_id: post.user_id,
            post_id: post.id,
            platform: post.platform,
            metric_type: 'published',
            metric_value: 1,
            metadata: { source: 'edge-scheduler' },
          })
        });

        processed += 1;
      } catch (e) {
        console.log('Error processing post:', e);
      }
    }

    return new Response(JSON.stringify({ ok: true, processed }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(`Unhandled error: ${e.message}`, { status: 500 });
  }
});
