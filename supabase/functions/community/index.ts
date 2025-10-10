// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      'https://yaincoxihiqdksxgrsrk.supabase.co',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/').filter(Boolean)

    // GET /community/posts - Get all posts
    if (req.method === 'GET' && path[path.length - 1] === 'posts') {
      const { data: posts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(JSON.stringify({ posts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /community/posts - Create a post
    if (req.method === 'POST' && path[path.length - 1] === 'posts') {
      const { content, mood, isAnonymous = false } = await req.json()

      const { data: post, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content,
          mood,
          is_anonymous: isAnonymous,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ post }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /community/posts/:id/like - Like a post
    if (req.method === 'POST' && path.includes('like')) {
      const postId = path[path.length - 2]

      // Check if already liked
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        return new Response(JSON.stringify({ liked: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      } else {
        // Like
        await supabase
          .from('community_likes')
          .insert({
            post_id: postId,
            user_id: user.id,
          })

        return new Response(JSON.stringify({ liked: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // GET /community/posts/:id/comments - Get comments for a post
    if (req.method === 'GET' && path.includes('comments')) {
      const postId = path[path.length - 2]

      const { data: comments, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ comments }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // POST /community/posts/:id/comments - Add a comment
    if (req.method === 'POST' && path.includes('comments')) {
      const postId = path[path.length - 2]
      const { content, isAnonymous = false } = await req.json()

      const { data: comment, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: isAnonymous,
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ comment }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // DELETE /community/posts/:id - Delete a post
    if (req.method === 'DELETE' && path[path.length - 2] === 'posts') {
      const postId = path[path.length - 1]

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // GET /community/stats - Get user community stats
    if (req.method === 'GET' && path[path.length - 1] === 'stats') {
      const { data: posts } = await supabase
        .from('community_posts')
        .select('id')
        .eq('user_id', user.id)

      const { data: comments } = await supabase
        .from('community_comments')
        .select('id')
        .eq('user_id', user.id)

      const { data: likes } = await supabase
        .from('community_likes')
        .select('id')
        .eq('user_id', user.id)

      return new Response(JSON.stringify({
        totalPosts: posts?.length || 0,
        totalComments: comments?.length || 0,
        totalLikes: likes?.length || 0,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('Community function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
