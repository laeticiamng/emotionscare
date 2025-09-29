
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const since = url.searchParams.get('since') || '8 weeks';

    // Simuler des métriques musicales hebdomadaires pour l'utilisateur
    const weeklyMetrics = Array.from({ length: 8 }, (_, i) => {
      const weekStart = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000);
      
      return {
        id: crypto.randomUUID(),
        user_id: user.id,
        week_start: weekStart.toISOString().split('T')[0],
        total_listening_time: Math.floor(Math.random() * 300) + 120, // 120-420 minutes
        sessions_count: Math.floor(Math.random() * 15) + 5, // 5-20 sessions
        avg_session_duration: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
        wellness_improvement: Math.random() * 0.3 + 0.6, // 60-90%
        favorite_genres: ['ambient', 'nature', 'meditation'].slice(0, Math.floor(Math.random() * 3) + 1),
        mood_before_avg: Math.floor(Math.random() * 30) + 40, // 40-70
        mood_after_avg: Math.floor(Math.random() * 25) + 70, // 70-95
        tracks_liked: Math.floor(Math.random() * 10) + 2,
        created_at: new Date().toISOString()
      };
    });

    // Calculer des statistiques globales
    const totalListeningTime = weeklyMetrics.reduce((sum, week) => sum + week.total_listening_time, 0);
    const avgWellnessImprovement = weeklyMetrics.reduce((sum, week) => sum + week.wellness_improvement, 0) / weeklyMetrics.length;

    return new Response(
      JSON.stringify({
        success: true,
        data: weeklyMetrics,
        user_id: user.id,
        period: since,
        summary: {
          total_listening_time: totalListeningTime,
          avg_wellness_improvement: avgWellnessImprovement.toFixed(2),
          consistency_score: weeklyMetrics.filter(w => w.sessions_count >= 3).length * 12.5 // %
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in music-weekly-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
