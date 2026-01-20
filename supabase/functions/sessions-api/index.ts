// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SessionRequest {
  action: 'start' | 'pause' | 'resume' | 'complete' | 'list' | 'get' | 'stats';
  sessionId?: string;
  sessionType?: 'music' | 'breath' | 'emotion' | 'journal' | 'coach' | 'meditation';
  subtype?: string;
  metadata?: Record<string, unknown>;
  limit?: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: SessionRequest = await req.json();
    const { action, sessionId, sessionType, subtype, metadata, limit = 20 } = body;

    console.log(`[sessions-api] Action: ${action}, User: ${user.id}`);

    let result;

    switch (action) {
      case 'start': {
        if (!sessionType) {
          return new Response(
            JSON.stringify({ error: 'sessionType is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('activity_sessions')
          .insert({
            user_id: user.id,
            activity_id: null, // Can be linked to specific activity
            started_at: new Date().toISOString(),
            metadata: {
              session_type: sessionType,
              subtype: subtype || null,
              ...metadata,
            },
          })
          .select()
          .single();

        if (error) throw error;
        result = { session: data, message: 'Session started' };
        break;
      }

      case 'pause': {
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: 'sessionId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('activity_sessions')
          .update({
            metadata: supabase.rpc ? undefined : { status: 'paused', paused_at: new Date().toISOString() },
          })
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = { session: data, message: 'Session paused' };
        break;
      }

      case 'resume': {
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: 'sessionId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('activity_sessions')
          .update({
            metadata: { status: 'active', resumed_at: new Date().toISOString() },
          })
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        result = { session: data, message: 'Session resumed' };
        break;
      }

      case 'complete': {
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: 'sessionId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const now = new Date();
        
        // Get session to calculate duration
        const { data: session } = await supabase
          .from('activity_sessions')
          .select('started_at')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        const startTime = session?.started_at ? new Date(session.started_at) : now;
        const durationSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);

        const { data, error } = await supabase
          .from('activity_sessions')
          .update({
            completed: true,
            completed_at: now.toISOString(),
            duration_seconds: durationSeconds,
            metadata: { ...metadata, status: 'completed' },
          })
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        // Award XP for completing session
        const xpEarned = Math.min(durationSeconds, 1800) / 60 * 5; // 5 XP per minute, max 30 min
        
        await supabase
          .from('activity_sessions')
          .update({ xp_earned: Math.floor(xpEarned) })
          .eq('id', sessionId);

        result = { session: data, xpEarned: Math.floor(xpEarned), message: 'Session completed' };
        break;
      }

      case 'list': {
        const { data, error } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        result = { sessions: data };
        break;
      }

      case 'get': {
        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: 'sessionId is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('activity_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        result = { session: data };
        break;
      }

      case 'stats': {
        // Get user stats
        const { data: sessions, error } = await supabase
          .from('activity_sessions')
          .select('duration_seconds, completed, xp_earned, metadata, started_at')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (error) throw error;

        const stats = {
          totalSessions: sessions?.length || 0,
          totalMinutes: Math.floor((sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0) / 60),
          totalXp: sessions?.reduce((acc, s) => acc + (s.xp_earned || 0), 0) || 0,
          byType: {} as Record<string, number>,
          last7Days: 0,
          last30Days: 0,
        };

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        sessions?.forEach((s) => {
          const sessionType = s.metadata?.session_type || 'unknown';
          stats.byType[sessionType] = (stats.byType[sessionType] || 0) + 1;

          const startedAt = new Date(s.started_at);
          if (startedAt >= sevenDaysAgo) stats.last7Days++;
          if (startedAt >= thirtyDaysAgo) stats.last30Days++;
        });

        result = { stats };
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[sessions-api] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
