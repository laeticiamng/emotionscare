// @ts-nocheck
/**
 * Meditation API - Backend for meditation sessions
 * Handles session management, stats, and analytics
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MeditationSession {
  id: string;
  user_id: string;
  technique: string;
  duration: number;
  completed_duration?: number;
  mood_before?: number;
  mood_after?: number;
  mood_delta?: number;
  with_guidance: boolean;
  with_music: boolean;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

interface CreateSessionPayload {
  technique: string;
  duration: number;
  moodBefore?: number;
  withGuidance?: boolean;
  withMusic?: boolean;
}

interface CompleteSessionPayload {
  sessionId: string;
  completedDuration: number;
  moodAfter?: number;
}

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
      case 'create': {
        const payload = body as CreateSessionPayload & { action: string };
        const sessionData = {
          user_id: user.id,
          technique: payload.technique,
          duration: payload.duration * 60,
          mood_before: payload.moodBefore ?? null,
          with_guidance: payload.withGuidance ?? false,
          with_music: payload.withMusic ?? false,
          completed: false,
        };

        const { data: session, error } = await supabase
          .from('meditation_sessions')
          .insert(sessionData)
          .select()
          .single();

        if (error) throw error;

        console.log('[meditation-api] Session created:', session.id);
        return new Response(JSON.stringify({ session }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'complete': {
        const payload = body as CompleteSessionPayload & { action: string };
        const updateData: Record<string, unknown> = {
          completed: true,
          completed_duration: payload.completedDuration,
          completed_at: new Date().toISOString(),
        };

        if (payload.moodAfter !== undefined) {
          updateData.mood_after = payload.moodAfter;
        }

        const { data: session, error } = await supabase
          .from('meditation_sessions')
          .update(updateData)
          .eq('id', payload.sessionId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;

        // Calculate mood delta
        if (session.mood_before !== null && session.mood_after !== null) {
          const moodDelta = session.mood_after - session.mood_before;
          await supabase
            .from('meditation_sessions')
            .update({ mood_delta: moodDelta })
            .eq('id', payload.sessionId);
        }

        console.log('[meditation-api] Session completed:', session.id);
        return new Response(JSON.stringify({ session }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'stats': {
        const { data: sessions, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const completedSessions = sessions?.filter(s => s.completed) || [];
        const totalSessions = completedSessions.length;

        if (totalSessions === 0) {
          return new Response(JSON.stringify({
            stats: {
              totalSessions: 0,
              totalDuration: 0,
              averageDuration: 0,
              favoriteTechnique: null,
              completionRate: 0,
              currentStreak: 0,
              longestStreak: 0,
              avgMoodDelta: null,
            }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const totalDuration = completedSessions.reduce((sum, s) => sum + (s.completed_duration || 0), 0);
        const averageDuration = totalDuration / totalSessions;

        // Favorite technique
        const techniqueCounts: Record<string, number> = {};
        completedSessions.forEach(s => {
          techniqueCounts[s.technique] = (techniqueCounts[s.technique] || 0) + 1;
        });
        const entries = Object.entries(techniqueCounts);
        const topTechnique = entries.sort((a, b) => b[1] - a[1])[0];
        const favoriteTechnique = topTechnique ? topTechnique[0] : null;

        // Completion rate
        const allSessions = sessions?.length || 0;
        const completionRate = allSessions > 0 ? (totalSessions / allSessions) * 100 : 0;

        // Mood delta average
        const moodDeltas = completedSessions
          .filter(s => s.mood_delta !== null)
          .map(s => s.mood_delta);
        const avgMoodDelta = moodDeltas.length > 0
          ? moodDeltas.reduce((sum, d) => sum + d, 0) / moodDeltas.length
          : null;

        // Streaks calculation
        const sessionsByDate: Record<string, boolean> = {};
        completedSessions.forEach(s => {
          const date = new Date(s.completed_at || s.created_at).toDateString();
          sessionsByDate[date] = true;
        });

        const dates = Object.keys(sessionsByDate).sort((a, b) =>
          new Date(b).getTime() - new Date(a).getTime()
        );

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate = dates[0] ? new Date(dates[0]) : new Date();

        for (const dateStr of dates) {
          const date = new Date(dateStr);
          const daysDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff <= 1) {
            tempStreak++;
            if (currentStreak === 0) currentStreak = tempStreak;
          } else {
            if (tempStreak > longestStreak) longestStreak = tempStreak;
            tempStreak = 1;
          }

          lastDate = date;
        }

        if (tempStreak > longestStreak) longestStreak = tempStreak;

        return new Response(JSON.stringify({
          stats: {
            totalSessions,
            totalDuration,
            averageDuration,
            favoriteTechnique,
            completionRate,
            currentStreak,
            longestStreak,
            avgMoodDelta,
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'recent': {
        const limit = body.limit || 10;
        const { data: sessions, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        return new Response(JSON.stringify({ sessions: sessions || [] }), {
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
    console.error('[meditation-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
