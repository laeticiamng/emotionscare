// @ts-nocheck
/**
 * Group Sessions API - Backend for collaborative wellness sessions
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'list': {
        const { category, status, upcoming } = body;
        let query = supabase
          .from('group_sessions')
          .select('*, host:host_id(id, display_name, avatar_url)')
          .order('scheduled_at', { ascending: true });

        if (category) query = query.eq('category', category);
        if (status) query = query.eq('status', status);
        if (upcoming) query = query.gte('scheduled_at', new Date().toISOString());

        const { data, error } = await query;
        if (error) throw error;

        return new Response(JSON.stringify({ sessions: data || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get': {
        const { sessionId } = body;
        const { data, error } = await supabase
          .from('group_sessions')
          .select('*, host:host_id(id, display_name, avatar_url), participants:group_session_participants(*)')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ session: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        const { title, description, category, scheduledAt, maxParticipants, duration, isPrivate } = body;
        
        const { data, error } = await supabase
          .from('group_sessions')
          .insert({
            host_id: user.id,
            title,
            description,
            category,
            scheduled_at: scheduledAt,
            max_participants: maxParticipants || 10,
            duration_minutes: duration || 30,
            is_private: isPrivate || false,
            status: 'scheduled',
          })
          .select()
          .single();

        if (error) throw error;

        // Auto-join host as participant
        await supabase.from('group_session_participants').insert({
          session_id: data.id,
          user_id: user.id,
          role: 'host',
          joined_at: new Date().toISOString(),
        });

        console.log('[group-sessions-api] Session created:', data.id);
        return new Response(JSON.stringify({ session: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'join': {
        const { sessionId } = body;
        
        // Check if session exists and has space
        const { data: session, error: sessionError } = await supabase
          .from('group_sessions')
          .select('*, participants:group_session_participants(count)')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;

        const participantCount = session.participants?.[0]?.count || 0;
        if (participantCount >= session.max_participants) {
          return new Response(JSON.stringify({ error: 'Session is full' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error } = await supabase
          .from('group_session_participants')
          .upsert({
            session_id: sessionId,
            user_id: user.id,
            role: 'participant',
            joined_at: new Date().toISOString(),
          });

        if (error) throw error;

        console.log('[group-sessions-api] User joined session:', sessionId);
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'leave': {
        const { sessionId } = body;
        
        const { error } = await supabase
          .from('group_session_participants')
          .delete()
          .eq('session_id', sessionId)
          .eq('user_id', user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'start': {
        const { sessionId } = body;
        
        const { data, error } = await supabase
          .from('group_sessions')
          .update({
            status: 'active',
            started_at: new Date().toISOString(),
          })
          .eq('id', sessionId)
          .eq('host_id', user.id)
          .select()
          .single();

        if (error) throw error;

        console.log('[group-sessions-api] Session started:', sessionId);
        return new Response(JSON.stringify({ session: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'end': {
        const { sessionId } = body;
        
        const { data, error } = await supabase
          .from('group_sessions')
          .update({
            status: 'completed',
            ended_at: new Date().toISOString(),
          })
          .eq('id', sessionId)
          .eq('host_id', user.id)
          .select()
          .single();

        if (error) throw error;

        console.log('[group-sessions-api] Session ended:', sessionId);
        return new Response(JSON.stringify({ session: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'myHosted': {
        const { data, error } = await supabase
          .from('group_sessions')
          .select('*')
          .eq('host_id', user.id)
          .order('scheduled_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ sessions: data || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'myJoined': {
        const { data, error } = await supabase
          .from('group_session_participants')
          .select('session:session_id(*, host:host_id(id, display_name, avatar_url))')
          .eq('user_id', user.id)
          .order('joined_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ 
          sessions: (data || []).map(d => d.session) 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[group-sessions-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
