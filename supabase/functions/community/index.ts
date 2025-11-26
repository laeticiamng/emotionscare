/**
 * community - API communautaire (posts, likes, comments)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 60/min + CORS restrictif
 */

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { authenticateRequest, logUnauthorizedAccess } from '../_shared/auth-middleware.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

Deno.serve(async (req: Request) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[community] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. 🔒 Authentification obligatoire
    const authResult = await authenticateRequest(req);
    if (authResult.status !== 200 || !authResult.user) {
      await logUnauthorizedAccess(req, authResult.error || 'Authentication failed');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = authResult.user;

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'community',
      userId: user.id,
      limit: 60,
      windowMs: 60_000,
      description: 'Community API operations',
    });

    if (!rateLimit.allowed) {
      console.warn('[community] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    // Utiliser les variables d'environnement (pas d'URL hardcodée!)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);

    // GET /community/posts - Get all posts
    if (req.method === 'GET' && path[path.length - 1] === 'posts') {
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /community/posts - Create a post
    if (req.method === 'POST' && path[path.length - 1] === 'posts') {
      const { content, mood, isAnonymous = false } = await req.json();

      // Validation du contenu
      if (!content || typeof content !== 'string' || content.length < 1 || content.length > 5000) {
        return new Response(JSON.stringify({ error: 'Invalid content (1-5000 chars)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: post, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content,
          mood,
          is_anonymous: isAnonymous,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[community] Post created:', { postId: post.id, userId: user.id });

      return new Response(JSON.stringify({ post }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /community/posts/:id/like - Like a post
    if (req.method === 'POST' && path.includes('like')) {
      const postId = path[path.length - 2];

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase.from('community_likes').delete().eq('post_id', postId).eq('user_id', user.id);

        return new Response(JSON.stringify({ liked: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Like
        await supabase.from('community_likes').insert({
          post_id: postId,
          user_id: user.id,
        });

        return new Response(JSON.stringify({ liked: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // GET /community/posts/:id/comments - Get comments for a post
    if (req.method === 'GET' && path.includes('comments')) {
      const postId = path[path.length - 2];

      const { data: comments, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({ comments }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /community/posts/:id/comments - Add a comment
    if (req.method === 'POST' && path.includes('comments')) {
      const postId = path[path.length - 2];
      const { content, isAnonymous = false } = await req.json();

      // Validation du contenu
      if (!content || typeof content !== 'string' || content.length < 1 || content.length > 2000) {
        return new Response(JSON.stringify({ error: 'Invalid content (1-2000 chars)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: comment, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: isAnonymous,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ comment }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /community/posts/:id - Delete a post
    if (req.method === 'DELETE' && path[path.length - 2] === 'posts') {
      const postId = path[path.length - 1];

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // S'assurer que c'est le propriétaire

      if (error) throw error;

      console.log('[community] Post deleted:', { postId, userId: user.id });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /community/stats - Get user community stats
    if (req.method === 'GET' && path[path.length - 1] === 'stats') {
      const { data: posts } = await supabase.from('community_posts').select('id').eq('user_id', user.id);

      const { data: comments } = await supabase.from('community_comments').select('id').eq('user_id', user.id);

      const { data: likes } = await supabase.from('community_likes').select('id').eq('user_id', user.id);

      return new Response(
        JSON.stringify({
          totalPosts: posts?.length || 0,
          totalComments: comments?.length || 0,
          totalLikes: likes?.length || 0,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[community] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
