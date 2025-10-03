import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
};

const computeSatisfactionScore = (moodDelta: number | null): number | null => {
  if (moodDelta === null || Number.isNaN(moodDelta)) {
    return null;
  }

  if (moodDelta >= 10) return 5;
  if (moodDelta >= 3) return 4;
  if (moodDelta >= 0) return 3;
  if (moodDelta >= -3) return 2;
  return 1;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const {
        duration_s,
        label,
        glow_type = 'energy',
        intensity = 75,
        result = 'completed',
        metadata = {}
      } = body;

      const safeDuration = typeof duration_s === 'number' && Number.isFinite(duration_s)
        ? Math.max(0, Math.round(duration_s))
        : null;

      const rawMetadata = metadata && typeof metadata === 'object' ? metadata : {};
      const rawModeValue = typeof rawMetadata.mode === 'string' ? rawMetadata.mode : null;
      const normalizedMode = rawModeValue ? rawModeValue.trim().toLowerCase() : null;
      const sessionMode = normalizedMode === 'ultra'
        ? 'ultra'
        : normalizedMode === 'core'
          ? 'core'
          : null;
      const rawContext = typeof rawMetadata.context === 'string' ? rawMetadata.context : null;
      const contextHint = rawContext ? rawContext.toLowerCase() : '';
      const isUltraSession = sessionMode === 'ultra' || contextHint.includes('ultra');

      const rawMoodBefore = rawMetadata.moodBefore ?? rawMetadata.mood_before;
      const rawMoodAfter = rawMetadata.moodAfter ?? rawMetadata.mood_after;
      const normalizedMoodBefore = typeof rawMoodBefore === 'number' && Number.isFinite(rawMoodBefore)
        ? Math.max(0, Math.min(100, Math.round(rawMoodBefore)))
        : null;
      const normalizedMoodAfter = typeof rawMoodAfter === 'number' && Number.isFinite(rawMoodAfter)
        ? Math.max(0, Math.min(100, Math.round(rawMoodAfter)))
        : null;
      const normalizedMoodDelta = typeof rawMetadata.moodDelta === 'number' && Number.isFinite(rawMetadata.moodDelta)
        ? Math.round(rawMetadata.moodDelta)
        : normalizedMoodBefore !== null && normalizedMoodAfter !== null
          ? normalizedMoodAfter - normalizedMoodBefore
          : null;

      const finalMetadata = {
        ...rawMetadata,
        mode: sessionMode ?? rawModeValue ?? (isUltraSession ? 'ultra' : null),
        context: rawContext ?? rawMetadata.context ?? null,
        moodBefore: normalizedMoodBefore,
        moodAfter: normalizedMoodAfter,
        moodDelta: normalizedMoodDelta,
        recorded_at: new Date().toISOString(),
      };

      console.log('Flash Glow session:', {
        user_id: user.id,
        duration_s: safeDuration,
        label,
        glow_type,
        intensity,
        result,
        mood_delta: normalizedMoodDelta,
      });

      const { data: metricsRow, error: metricsError } = await supabase
        .from('metrics_flash_glow')
        .insert({
          user_id: user.id,
          payload: {
            duration_s: safeDuration,
            label,
            glow_type,
            intensity,
            result,
            metadata: finalMetadata,
          },
        })
        .select('id, session_id')
        .single();

      if (metricsError) {
        console.error('Error inserting flash glow metrics:', metricsError);
        return new Response(JSON.stringify({ error: 'Failed to save metrics' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const satisfactionScore = computeSatisfactionScore(normalizedMoodDelta);
      const activityType = isUltraSession ? 'flash_glow_ultra' : 'flash_glow';

      const { data: activityRow, error: activityError } = await supabase
        .from('user_activity_sessions')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          duration_seconds: safeDuration,
          completed_at: new Date().toISOString(),
          mood_before: normalizedMoodBefore !== null ? String(normalizedMoodBefore) : null,
          mood_after: normalizedMoodAfter !== null ? String(normalizedMoodAfter) : null,
          satisfaction_score: satisfactionScore,
          session_data: {
            label,
            glow_type,
            intensity,
            result,
            metadata: finalMetadata,
            metrics_id: metricsRow?.id ?? null,
            metrics_session_id: metricsRow?.session_id ?? null,
            session_mode: sessionMode ?? (isUltraSession ? 'ultra' : null),
          },
        })
        .select('id')
        .single();

      if (activityError) {
        console.error('Error logging flash glow activity session:', activityError);
        return new Response(JSON.stringify({ error: 'Failed to log session' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let recommendation = '';
      if (label === 'gain') {
        recommendation = 'Excellent ! Votre énergie rayonne ✨';
      } else if (label === 'léger') {
        recommendation = 'Progrès en douceur, continuez 🌟';
      } else {
        recommendation = 'Chaque glow compte, félicitations 💫';
      }

      return new Response(JSON.stringify({
        success: true,
        message: recommendation,
        next_session_in: '4h',
        session_id: metricsRow?.session_id ?? null,
        activity_session_id: activityRow?.id ?? null,
        mood_delta: normalizedMoodDelta,
        satisfaction_score: satisfactionScore,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'GET') {
      const { data: metrics, error: metricsError } = await supabase
        .from('metrics_flash_glow')
        .select('id, session_id, ts, payload')
        .eq('user_id', user.id)
        .order('ts', { ascending: false })
        .limit(25);

      if (metricsError) {
        console.error('Error fetching flash glow metrics:', metricsError);
        return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const normalized = (metrics ?? []).map((row) => {
        const payload = (row.payload ?? {}) as Record<string, unknown>;
        const metadata = (payload.metadata ?? {}) as Record<string, unknown>;
        const duration = typeof payload.duration_s === 'number'
          ? payload.duration_s as number
          : typeof payload.duration === 'number'
            ? payload.duration as number
            : 0;

        const moodDeltaValue = typeof metadata.moodDelta === 'number'
          ? metadata.moodDelta as number
          : typeof metadata.mood_delta === 'number'
            ? metadata.mood_delta as number
            : null;

        return {
          id: row.id,
          session_id: row.session_id,
          ts: row.ts,
          duration_s: duration,
          label: (payload.label as string) ?? 'incertain',
          mood_delta: moodDeltaValue,
        };
      });

      const totalSessions = normalized.length;
      const avgDuration = totalSessions
        ? Math.round(normalized.reduce((sum, entry) => sum + (entry.duration_s || 0), 0) / totalSessions)
        : 0;

      return new Response(JSON.stringify({
        total_sessions: totalSessions,
        avg_duration: avgDuration,
        recent_sessions: normalized.slice(0, 5),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error('Error in flash-glow-metrics function:', error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});