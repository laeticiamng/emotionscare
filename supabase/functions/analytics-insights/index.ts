// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  action: 'generate_insights' | 'get_trends' | 'predict_wellness';
  timeframe?: 'week' | 'month' | 'quarter';
  userId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: AnalyticsRequest = await req.json();
    const { action, timeframe = 'week' } = body;

    console.log('📊 Analytics request:', { user_id: user.id, action, timeframe });

    switch (action) {
      case 'generate_insights':
        return await generateAIInsights(supabase, user.id, timeframe);
      
      case 'get_trends':
        return await getEmotionalTrends(supabase, user.id, timeframe);
      
      case 'predict_wellness':
        return await predictWellnessScore(supabase, user.id);
      
      default:
        return new Response(JSON.stringify({ error: 'Action inconnue' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Erreur interne' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateAIInsights(supabase: any, userId: string, timeframe: string) {
  // Récupérer les données utilisateur
  const userData = await fetchUserAnalyticsData(supabase, userId, timeframe);
  
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY non configuré');
  }

  const prompt = `Tu es un psychologue AI expert en analyse du bien-être émotionnel.

Données utilisateur (${timeframe}) :
- Sessions d'analyse : ${userData.sessionCount}
- Émotions dominantes : ${userData.emotions.join(', ')}
- Score de bien-être moyen : ${userData.avgWellness}/100
- Activités : ${userData.activities.join(', ')}
- Sommeil moyen : ${userData.avgSleep}h/nuit
- Niveau de stress moyen : ${userData.avgStress}/10

Génère des insights personnalisés et actionnables :
1. Analyse de l'état émotionnel
2. Tendances positives identifiées
3. Points d'attention
4. Recommandations concrètes (3-4)
5. Score de progression prévisionnel

Format : JSON structuré`;

  console.log('🤖 Generating insights with AI...');

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'Tu es un expert en analyse du bien-être. Réponds toujours en JSON valide.' },
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI Gateway error:', response.status, errorText);
    throw new Error('Erreur lors de la génération des insights');
  }

  const aiData = await response.json();
  let insights;
  
  try {
    const content = aiData.choices[0].message.content;
    // Nettoyer le contenu pour extraire le JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    insights = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      emotional_state: 'Analyse en cours...',
      positive_trends: ['Continuez vos bonnes pratiques'],
      attention_points: ['Données insuffisantes pour analyse détaillée'],
      recommendations: ['Continuer à utiliser l\'application régulièrement'],
      predicted_score: userData.avgWellness
    };
  } catch (e) {
    console.error('Error parsing AI response:', e);
    insights = {
      emotional_state: 'Analyse générée',
      positive_trends: ['Engagement régulier avec la plateforme'],
      attention_points: ['Continuer le suivi'],
      recommendations: ['Maintenir une pratique régulière'],
      predicted_score: userData.avgWellness
    };
  }

  // Sauvegarder les insights
  const { data: savedInsight } = await supabase
    .from('analytics_insights')
    .insert({
      user_id: userId,
      timeframe,
      insights_data: insights,
      user_data_snapshot: userData,
      generated_at: new Date().toISOString(),
    })
    .select()
    .single();

  console.log('✅ Insights generated:', savedInsight?.id);

  return new Response(
    JSON.stringify({
      insights,
      userData,
      message: 'Insights générés avec succès',
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function getEmotionalTrends(supabase: any, userId: string, timeframe: string) {
  const daysAgo = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
  
  // Simuler des tendances (à remplacer par vraies requêtes DB)
  const trends = {
    emotional_progression: [
      { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), score: 65, emotion: 'neutral' },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), score: 70, emotion: 'happy' },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), score: 68, emotion: 'calm' },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), score: 75, emotion: 'happy' },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: 72, emotion: 'energetic' },
      { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: 78, emotion: 'happy' },
      { date: new Date().toISOString(), score: 80, emotion: 'happy' },
    ],
    activity_correlation: {
      meditation: { frequency: 5, avg_improvement: 12 },
      music_therapy: { frequency: 8, avg_improvement: 15 },
      vr_sessions: { frequency: 3, avg_improvement: 18 },
      journaling: { frequency: 6, avg_improvement: 10 },
    },
    peak_times: ['09:00-11:00', '16:00-18:00'],
    improvement_rate: 15.5,
  };

  return new Response(
    JSON.stringify({ trends, timeframe }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function predictWellnessScore(supabase: any, userId: string) {
  // Récupérer l'historique
  const userData = await fetchUserAnalyticsData(supabase, userId, 'month');
  
  // Prédiction simple basée sur la tendance
  const currentScore = userData.avgWellness;
  const trend = userData.sessionCount > 10 ? 5 : 2;
  const predictedScore = Math.min(100, currentScore + trend);
  
  const prediction = {
    current_score: currentScore,
    predicted_score_7days: predictedScore,
    predicted_score_30days: Math.min(100, currentScore + trend * 2),
    confidence: userData.sessionCount > 10 ? 0.85 : 0.65,
    factors: {
      consistency: userData.sessionCount / 30,
      activity_diversity: userData.activities.length / 5,
      emotional_stability: 0.75,
    },
    recommendations: [
      'Maintenir une pratique régulière',
      'Explorer de nouvelles activités',
      'Suivre votre progression hebdomadaire',
    ],
  };

  return new Response(
    JSON.stringify({ prediction }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

async function fetchUserAnalyticsData(supabase: any, userId: string, timeframe: string) {
  // Simuler des données (à remplacer par vraies requêtes)
  return {
    sessionCount: Math.floor(Math.random() * 20) + 10,
    emotions: ['happy', 'calm', 'energetic', 'neutral'],
    avgWellness: Math.floor(Math.random() * 30) + 65,
    activities: ['meditation', 'music_therapy', 'vr_sessions', 'journaling'],
    avgSleep: 7.2,
    avgStress: 4.5,
    timeframe,
  };
}
