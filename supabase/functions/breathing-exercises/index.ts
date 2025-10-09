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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, sessionData, sessionId } = await req.json();

    switch (action) {
      case 'start-session': {
        const { data, error } = await supabaseClient
          .from('breathing_vr_sessions')
          .insert({
            user_id: user.id,
            pattern: sessionData.pattern,
            vr_mode: false,
            started_at: new Date().toISOString(),
            mood_before: sessionData.moodBefore,
            duration_seconds: 0
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, session: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'complete-session': {
        const { data, error } = await supabaseClient
          .from('breathing_vr_sessions')
          .update({
            completed_at: new Date().toISOString(),
            duration_seconds: sessionData.durationSeconds,
            cycles_completed: sessionData.cyclesCompleted,
            average_pace: sessionData.averagePace,
            mood_after: sessionData.moodAfter,
            notes: sessionData.notes
          })
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, session: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-sessions': {
        const { data, error } = await supabaseClient
          .from('breathing_vr_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, sessions: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get-insights': {
        const { data, error } = await supabaseClient
          .from('breathing_vr_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        const totalSessions = data.length;
        const totalMinutes = data.reduce((sum, s) => sum + (s.duration_seconds / 60), 0);
        const avgMoodImprovement = data
          .filter(s => s.mood_before && s.mood_after)
          .reduce((sum, s) => sum + (s.mood_after - s.mood_before), 0) / (data.filter(s => s.mood_before && s.mood_after).length || 1);

        const insights = {
          totalSessions,
          totalMinutes: Math.round(totalMinutes),
          avgMoodImprovement: avgMoodImprovement.toFixed(1),
          streak: calculateStreak(data),
          favoritePattern: getMostUsedPattern(data)
        };

        return new Response(
          JSON.stringify({ success: true, insights }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Action invalide' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in breathing-exercises function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculateStreak(sessions: any[]): number {
  if (!sessions.length) return 0;
  
  let streak = 1;
  const sortedDates = sessions
    .map(s => new Date(s.created_at).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const next = new Date(sortedDates[i + 1]);
    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function getMostUsedPattern(sessions: any[]): string {
  if (!sessions.length) return 'Aucun';
  
  const patternCounts = sessions.reduce((acc, s) => {
    acc[s.pattern] = (acc[s.pattern] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(patternCounts).reduce((a, b) => 
    patternCounts[a] > patternCounts[b] ? a : b
  );
}
