// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
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
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean).slice(1);

    // GET /ai-coaching/sessions - Récupérer les sessions de coaching
    if (req.method === 'GET' && path[0] === 'sessions') {
      const { data: sessions, error } = await supabaseClient
        .from('ai_coach_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      return new Response(JSON.stringify({ sessions }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /ai-coaching/sessions - Créer une nouvelle session
    if (req.method === 'POST' && path[0] === 'sessions') {
      const { coach_personality, initial_emotion } = await req.json();

      const { data: session, error } = await supabaseClient
        .from('ai_coach_sessions')
        .insert({
          user_id: user.id,
          coach_personality: coach_personality || 'empathetic',
          emotions_detected: initial_emotion ? [initial_emotion] : [],
          session_notes: 'Session initiée',
          messages_count: 0,
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ session }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /ai-coaching/chat - Envoyer un message au coach IA
    if (req.method === 'POST' && path[0] === 'chat') {
      const { session_id, message, emotion } = await req.json();

      // Vérifier que la session appartient à l'utilisateur
      const { data: session, error: sessionError } = await supabaseClient
        .from('ai_coach_sessions')
        .select('*')
        .eq('id', session_id)
        .eq('user_id', user.id)
        .single();

      if (sessionError || !session) {
        return new Response(JSON.stringify({ error: 'Session non trouvée' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Générer une réponse du coach IA (simulation pour démo)
      const coachResponses = {
        empathetic: [
          "Je comprends ce que vous ressentez. C'est une réaction tout à fait normale.",
          "Merci de partager cela avec moi. Vos émotions sont valides et importantes.",
          "Je suis là pour vous écouter. Prenez le temps dont vous avez besoin.",
        ],
        motivational: [
          "Vous avez fait un grand pas en reconnaissant ce que vous ressentez !",
          "C'est excellent ! Chaque petite victoire compte sur ce chemin.",
          "Vous êtes sur la bonne voie. Continuez comme ça !",
        ],
        analytical: [
          "Analysons ensemble ce qui a déclenché cette émotion.",
          "Quels sont les patterns que vous observez dans vos réactions ?",
          "Essayons d'identifier les facteurs qui influencent votre état émotionnel.",
        ],
      };

      const personality = session.coach_personality || 'empathetic';
      const responses = coachResponses[personality as keyof typeof coachResponses] || coachResponses.empathetic;
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];

      // Mettre à jour la session
      const emotions = session.emotions_detected || [];
      if (emotion && !emotions.includes(emotion)) {
        emotions.push(emotion);
      }

      await supabaseClient
        .from('ai_coach_sessions')
        .update({
          messages_count: (session.messages_count || 0) + 1,
          emotions_detected: emotions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session_id);

      return new Response(
        JSON.stringify({
          response: aiResponse,
          emotion_detected: emotion,
          suggestions: [
            { type: 'breathing', title: 'Exercice de respiration', duration: 5 },
            { type: 'meditation', title: 'Méditation guidée', duration: 10 },
            { type: 'music', title: 'Musique apaisante', duration: 15 },
          ],
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /ai-coaching/sessions/:id/complete - Terminer une session
    if (req.method === 'POST' && path[0] === 'sessions' && path[2] === 'complete') {
      const sessionId = path[1];
      const { satisfaction_rating, notes } = await req.json();

      const { error } = await supabaseClient
        .from('ai_coach_sessions')
        .update({
          user_satisfaction: satisfaction_rating,
          session_notes: notes || 'Session terminée',
          updated_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: 'Session terminée avec succès' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /ai-coaching/recommendations - Obtenir des recommandations personnalisées
    if (req.method === 'GET' && path[0] === 'recommendations') {
      const { data: recentSessions } = await supabaseClient
        .from('ai_coach_sessions')
        .select('emotions_detected, techniques_suggested')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Analyser les patterns émotionnels
      const emotionCounts: Record<string, number> = {};
      recentSessions?.forEach((session: any) => {
        session.emotions_detected?.forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });

      const topEmotions = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion);

      const recommendations = [
        {
          type: 'exercise',
          title: 'Pratique quotidienne recommandée',
          description: `Basé sur vos émotions récentes (${topEmotions.join(', ')}), nous recommandons 10min de méditation matinale.`,
          priority: 'high',
        },
        {
          type: 'content',
          title: 'Lecture suggérée',
          description: 'Article : "Gérer le stress au quotidien"',
          priority: 'medium',
        },
        {
          type: 'technique',
          title: 'Nouvelle technique à essayer',
          description: 'Cohérence cardiaque - 5 minutes',
          priority: 'high',
        },
      ];

      return new Response(
        JSON.stringify({ recommendations, top_emotions: topEmotions }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
