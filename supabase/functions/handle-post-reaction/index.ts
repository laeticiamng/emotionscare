// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { post_id, reaction_type } = await req.json();
    
    // Get the current user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Processing reaction:', {
      post_id,
      reaction_type,
      user_id: user.id
    });

    // Check if user already reacted to this post
    const { data: existingReaction } = await supabase
      .from('post_reactions')
      .select('*')
      .eq('post_id', post_id)
      .eq('user_id', user.id)
      .single();

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        // Remove reaction if it's the same
        await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', post_id)
          .eq('user_id', user.id);
        
        console.log('Reaction removed');
      } else {
        // Update reaction type
        await supabase
          .from('post_reactions')
          .update({ reaction_type })
          .eq('post_id', post_id)
          .eq('user_id', user.id);
        
        console.log('Reaction updated');
      }
    } else {
      // Add new reaction
      await supabase
        .from('post_reactions')
        .insert({
          post_id,
          user_id: user.id,
          reaction_type
        });
      
      console.log('New reaction added');

      // Send notification to post author
      const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', post_id)
        .single();

      if (post && post.user_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user_id,
            type: 'post_reaction',
            title: 'Nouvelle réaction',
            message: `Quelqu'un a réagi à votre post avec ${reaction_type}`,
            data: {
              post_id,
              reaction_type,
              from_user_id: user.id
            }
          });
      }
    }

    // Get updated reaction counts
    const { data: reactionCounts } = await supabase
      .from('post_reactions')
      .select('reaction_type')
      .eq('post_id', post_id);

    const counts = reactionCounts?.reduce((acc, reaction) => {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return new Response(
      JSON.stringify({ 
        success: true,
        counts
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error handling post reaction:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});