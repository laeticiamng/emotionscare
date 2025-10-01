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
    const { action_id, decision, moderator_notes } = await req.json();
    
    // Get the current user (moderator)
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

    console.log('Processing moderation action:', {
      action_id,
      decision,
      moderator_id: user.id,
      notes: moderator_notes
    });

    // Store the moderation decision
    const { error: insertError } = await supabase
      .from('moderation_actions')
      .insert({
        action_id,
        moderator_id: user.id,
        decision,
        notes: moderator_notes,
        processed_at: new Date().toISOString()
      });

    if (insertError) {
      throw insertError;
    }

    // Apply the moderation decision
    switch (decision) {
      case 'approve':
        // Content is approved, no further action needed
        console.log('Content approved - no action required');
        break;
        
      case 'reject':
        // Content should be hidden/removed
        await handleContentRemoval(action_id);
        break;
        
      case 'escalate':
        // Escalate to senior moderator or admin
        await handleEscalation(action_id, user.id);
        break;
        
      default:
        throw new Error(`Unknown decision type: ${decision}`);
    }

    // Send analytics event
    await supabase.functions.invoke('analytics-track', {
      body: {
        event_name: 'moderation_action_processed',
        properties: {
          action_id,
          decision,
          moderator_id: user.id,
          timestamp: new Date().toISOString()
        }
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Moderation action ${decision} processed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error handling moderation action:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleContentRemoval(actionId: string) {
  console.log('Handling content removal for action:', actionId);
  
  // Mark content as removed/hidden
  await supabase
    .from('flagged_content')
    .update({ 
      status: 'removed',
      removed_at: new Date().toISOString()
    })
    .eq('action_id', actionId);

  // Send notification to content author about removal
  const { data: flaggedContent } = await supabase
    .from('flagged_content')
    .select('author_id, content_type, reason')
    .eq('action_id', actionId)
    .single();

  if (flaggedContent) {
    await supabase
      .from('notifications')
      .insert({
        user_id: flaggedContent.author_id,
        type: 'content_removed',
        title: 'Contenu supprimé',
        message: `Votre ${flaggedContent.content_type} a été supprimé car il ne respectait pas nos règles communautaires. Raison: ${flaggedContent.reason}`,
        data: {
          action_id: actionId,
          content_type: flaggedContent.content_type
        }
      });
  }
}

async function handleEscalation(actionId: string, moderatorId: string) {
  console.log('Handling escalation for action:', actionId);
  
  // Mark as escalated
  await supabase
    .from('moderation_escalations')
    .insert({
      action_id: actionId,
      escalated_by: moderatorId,
      escalated_at: new Date().toISOString(),
      status: 'pending_review'
    });

  // Notify senior moderators/admins
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['admin', 'senior_moderator']);

  if (admins && admins.length > 0) {
    const notifications = admins.map(admin => ({
      user_id: admin.id,
      type: 'moderation_escalation',
      title: 'Action de modération escaladée',
      message: 'Une action de modération nécessite votre attention',
      data: {
        action_id: actionId,
        escalated_by: moderatorId
      }
    }));

    await supabase
      .from('notifications')
      .insert(notifications);
  }
}