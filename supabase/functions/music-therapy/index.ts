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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Non authentifié');
    }

    const { action, emotion, duration, trackId } = await req.json();

    switch (action) {
      case 'recommend': {
        // Recommandations basées sur l'émotion
        const tracks = getTracksForEmotion(emotion);
        return new Response(
          JSON.stringify({ tracks }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'log_session': {
        // Enregistrer une session d'écoute
        const { error } = await supabaseClient
          .from('music_therapy_sessions')
          .insert({
            user_id: user.id,
            track_id: trackId,
            duration_seconds: duration,
            emotion_context: emotion,
          });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_history': {
        // Récupérer l'historique des sessions
        const { data, error } = await supabaseClient
          .from('music_therapy_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) throw error;

        return new Response(
          JSON.stringify({ sessions: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_insights': {
        // Insights sur l'utilisation de la musique
        const { data, error } = await supabaseClient
          .from('music_therapy_sessions')
          .select('emotion_context, duration_seconds')
          .eq('user_id', user.id);

        if (error) throw error;

        const insights = calculateMusicInsights(data);

        return new Response(
          JSON.stringify({ insights }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Action non reconnue');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getTracksForEmotion(emotion: string) {
  const trackDatabase = {
    stress: [
      { id: '1', title: 'Calme Océanique', frequency: '432 Hz', duration: 600, description: 'Sons binauraux pour réduction du stress' },
      { id: '2', title: 'Forêt Apaisante', frequency: '528 Hz', duration: 900, description: 'Ambiance naturelle relaxante' },
    ],
    anxiété: [
      { id: '3', title: 'Respiration Guidée', frequency: '396 Hz', duration: 480, description: 'Musique avec respiration guidée' },
      { id: '4', title: 'Sérénité', frequency: '432 Hz', duration: 720, description: 'Sons binauraux anti-anxiété' },
    ],
    tristesse: [
      { id: '5', title: 'Lumière Intérieure', frequency: '528 Hz', duration: 600, description: 'Musique énergisante douce' },
      { id: '6', title: 'Espoir', frequency: '639 Hz', duration: 840, description: 'Harmonies positives' },
    ],
    colère: [
      { id: '7', title: 'Apaisement', frequency: '432 Hz', duration: 720, description: 'Sons pour calmer la colère' },
      { id: '8', title: 'Équilibre', frequency: '528 Hz', duration: 600, description: 'Retour au calme' },
    ],
    neutral: [
      { id: '9', title: 'Focus Mental', frequency: '40 Hz', duration: 1200, description: 'Concentration et clarté' },
      { id: '10', title: 'Méditation', frequency: '432 Hz', duration: 900, description: 'État méditatif' },
    ],
  };

  return trackDatabase[emotion.toLowerCase()] || trackDatabase.neutral;
}

function calculateMusicInsights(sessions: any[]) {
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalDuration: 0,
      averageDuration: 0,
      favoriteEmotion: null,
      weeklyUsage: 0,
    };
  }

  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const emotionCounts = sessions.reduce((acc, s) => {
    acc[s.emotion_context] = (acc[s.emotion_context] || 0) + 1;
    return acc;
  }, {});

  const favoriteEmotion = Object.entries(emotionCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0];

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyUsage = sessions.filter(s => new Date(s.created_at) > oneWeekAgo).length;

  return {
    totalSessions: sessions.length,
    totalDuration: Math.round(totalDuration / 60), // en minutes
    averageDuration: Math.round(totalDuration / sessions.length / 60),
    favoriteEmotion,
    weeklyUsage,
  };
}
