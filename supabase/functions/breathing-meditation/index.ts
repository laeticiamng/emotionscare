// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // GET /exercises - List available breathing/meditation exercises
    if (req.method === 'GET' && path === 'exercises') {
      const exercises = [
        {
          id: 'coherence-cardiac',
          name: 'Cohérence cardiaque',
          type: 'breathing',
          duration: 300,
          description: '5 minutes de respiration guidée pour la cohérence cardiaque',
          pattern: { inhale: 5, hold: 0, exhale: 5, rest: 0 },
          benefits: ['Réduction du stress', 'Amélioration de la concentration', 'Régulation émotionnelle'],
        },
        {
          id: 'box-breathing',
          name: 'Respiration carrée',
          type: 'breathing',
          duration: 240,
          description: 'Technique militaire de gestion du stress',
          pattern: { inhale: 4, hold: 4, exhale: 4, rest: 4 },
          benefits: ['Calme mental', 'Réduction de l\'anxiété', 'Focus amélioré'],
        },
        {
          id: 'deep-relaxation',
          name: 'Relaxation profonde',
          type: 'breathing',
          duration: 480,
          description: 'Respiration lente pour relaxation profonde',
          pattern: { inhale: 4, hold: 2, exhale: 6, rest: 2 },
          benefits: ['Détente musculaire', 'Sommeil amélioré', 'Apaisement'],
        },
        {
          id: 'mindfulness-scan',
          name: 'Scan corporel mindfulness',
          type: 'meditation',
          duration: 600,
          description: 'Méditation guidée de scan corporel',
          script: 'Allongez-vous confortablement... Portez votre attention sur votre respiration...',
          benefits: ['Conscience corporelle', 'Détente profonde', 'Réduction douleurs'],
        },
        {
          id: 'loving-kindness',
          name: 'Méditation de bienveillance',
          type: 'meditation',
          duration: 480,
          description: 'Cultiver la compassion envers soi et les autres',
          script: 'Installez-vous confortablement... Pensez à une personne que vous aimez...',
          benefits: ['Compassion', 'Connexion sociale', 'Bien-être émotionnel'],
        },
        {
          id: 'stress-release',
          name: 'Libération du stress',
          type: 'meditation',
          duration: 420,
          description: 'Méditation guidée pour évacuer le stress',
          script: 'Fermez les yeux... Imaginez le stress quitter votre corps...',
          benefits: ['Stress libéré', 'Énergie renouvelée', 'Clarté mentale'],
        },
      ];

      return new Response(JSON.stringify({ exercises }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /sessions - Create a new session
    if (req.method === 'POST' && path === 'sessions') {
      const { exercise_id, duration, completed, biometric_data } = await req.json();

      const { data: session, error } = await supabase
        .from('breathing_meditation_sessions')
        .insert({
          user_id: user.id,
          exercise_id,
          duration_seconds: duration,
          completed_at: completed ? new Date().toISOString() : null,
          biometric_data: biometric_data || {},
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /sessions - Get user's sessions history
    if (req.method === 'GET' && path === 'sessions') {
      const limit = url.searchParams.get('limit') || '20';

      const { data: sessions, error } = await supabase
        .from('breathing_meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

      if (error) throw error;

      return new Response(JSON.stringify({ sessions }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PATCH /sessions/:id - Update session
    if (req.method === 'PATCH' && path !== 'exercises' && path !== 'sessions') {
      const sessionId = path;
      const { completed, biometric_data } = await req.json();

      const { data: session, error } = await supabase
        .from('breathing_meditation_sessions')
        .update({
          completed_at: completed ? new Date().toISOString() : null,
          biometric_data: biometric_data || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /stats - Get user statistics
    if (req.method === 'GET' && path === 'stats') {
      const { data: sessions, error } = await supabase
        .from('breathing_meditation_sessions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter((s: any) => s.completed_at).length;
      const totalMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) / 60;
      const streak = calculateStreak(sessions);

      const exerciseBreakdown = sessions.reduce((acc: any, s: any) => {
        acc[s.exercise_id] = (acc[s.exercise_id] || 0) + 1;
        return acc;
      }, {});

      return new Response(JSON.stringify({
        stats: {
          totalSessions,
          completedSessions,
          totalMinutes: Math.round(totalMinutes),
          currentStreak: streak,
          exerciseBreakdown,
        },
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateStreak(sessions: any[]): number {
  if (!sessions.length) return 0;

  const sortedDates = sessions
    .filter((s: any) => s.completed_at)
    .map((s: any) => new Date(s.completed_at).toDateString())
    .filter((date: string, index: number, self: string[]) => self.indexOf(date) === index)
    .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let currentDate = new Date();
  for (const dateStr of sortedDates) {
    const sessionDate = new Date(dateStr);
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / 86400000);

    if (daysDiff <= 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
}
