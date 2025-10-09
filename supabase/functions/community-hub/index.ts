// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { action, ...params } = await req.json();

    console.log('Community Hub - Action:', action, 'User:', user.id);

    switch (action) {
      case 'create_post': {
        const { content, category, is_anonymous, tags } = params;

        // Modération IA du contenu
        const moderationResult = await moderateContent(content);
        
        if (!moderationResult.approved) {
          return new Response(JSON.stringify({ 
            error: 'Contenu non conforme', 
            reason: moderationResult.reason 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: post, error: postError } = await supabase
          .from('community_posts')
          .insert({
            user_id: user.id,
            content,
            category: category || 'general',
            is_anonymous: is_anonymous || false,
            tags: tags || [],
            moderation_status: 'approved',
            moderation_score: moderationResult.score
          })
          .select()
          .single();

        if (postError) throw postError;

        return new Response(JSON.stringify({ 
          success: true, 
          post 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'list_posts': {
        const { filter = 'all', limit = 20, offset = 0 } = params;

        let query = supabase
          .from('community_posts')
          .select(`
            *,
            reactions:community_reactions(count),
            comments:community_comments(count)
          `)
          .eq('moderation_status', 'approved')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (filter === 'my_posts') {
          query = query.eq('user_id', user.id);
        } else if (filter === 'favorites') {
          query = query.eq('user_id', user.id).eq('is_favorite', true);
        }

        const { data: posts, error: postsError } = await query;
        if (postsError) throw postsError;

        return new Response(JSON.stringify({ 
          success: true, 
          posts 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'add_comment': {
        const { post_id, content } = params;

        const moderationResult = await moderateContent(content);
        
        if (!moderationResult.approved) {
          return new Response(JSON.stringify({ 
            error: 'Commentaire non conforme', 
            reason: moderationResult.reason 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const { data: comment, error: commentError } = await supabase
          .from('community_comments')
          .insert({
            post_id,
            user_id: user.id,
            content,
            moderation_status: 'approved'
          })
          .select()
          .single();

        if (commentError) throw commentError;

        return new Response(JSON.stringify({ 
          success: true, 
          comment 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'add_reaction': {
        const { post_id, reaction_type } = params;

        const { data: reaction, error: reactionError } = await supabase
          .from('community_reactions')
          .upsert({
            post_id,
            user_id: user.id,
            reaction_type: reaction_type || 'heart'
          }, {
            onConflict: 'post_id,user_id'
          })
          .select()
          .single();

        if (reactionError) throw reactionError;

        return new Response(JSON.stringify({ 
          success: true, 
          reaction 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      case 'get_stats': {
        const { data: userPosts } = await supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { data: userComments } = await supabase
          .from('community_comments')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { data: receivedReactions } = await supabase
          .from('community_reactions')
          .select('id', { count: 'exact', head: true })
          .in('post_id', 
            supabase.from('community_posts').select('id').eq('user_id', user.id)
          );

        return new Response(JSON.stringify({ 
          success: true, 
          stats: {
            total_posts: userPosts?.length || 0,
            total_comments: userComments?.length || 0,
            total_reactions_received: receivedReactions?.length || 0
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Action invalide' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error: any) {
    console.error('Erreur Community Hub:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function moderateContent(content: string): Promise<{
  approved: boolean;
  score: number;
  reason?: string;
}> {
  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.warn('LOVABLE_API_KEY non configurée, modération désactivée');
      return { approved: true, score: 100 };
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un modérateur de contenu pour une plateforme de bien-être émotionnel.
Analyse le contenu et retourne un JSON avec:
- approved: true/false (rejette uniquement les contenus dangereux, haineux, violents ou inappropriés)
- score: 0-100 (score de qualité du contenu)
- reason: string optionnelle si rejeté

Sois bienveillant et permissif pour les contenus émotionnels personnels.`
          },
          {
            role: 'user',
            content: `Analyse ce contenu: "${content}"`
          }
        ],
        tools: [
          {
            type: 'function',
            name: 'moderate_content',
            description: 'Retourne le résultat de la modération',
            parameters: {
              type: 'object',
              properties: {
                approved: { type: 'boolean' },
                score: { type: 'number' },
                reason: { type: 'string' }
              },
              required: ['approved', 'score'],
              additionalProperties: false
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'moderate_content' } }
      }),
    });

    if (!response.ok) {
      console.error('Erreur Lovable AI:', response.status);
      return { approved: true, score: 50 };
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return result;
    }

    return { approved: true, score: 50 };

  } catch (error) {
    console.error('Erreur modération:', error);
    return { approved: true, score: 50 };
  }
}
