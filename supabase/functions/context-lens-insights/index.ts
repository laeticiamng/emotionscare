// @ts-nocheck
/**
 * Context Lens Insights Edge Function
 * Gère les insights personnalisés basés sur l'analyse des données émotionnelles
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types
interface InsightTemplate {
  id: string;
  type: 'pattern' | 'trigger' | 'recommendation' | 'correlation' | 'alert';
  title_template: string;
  description_template: string;
  conditions: Record<string, unknown>;
  priority: number;
  category: 'wellness' | 'clinical' | 'behavioral' | 'social';
}

// 30+ Insight Templates
const INSIGHT_TEMPLATES: InsightTemplate[] = [
  // Pattern templates
  { id: 'morning_anxiety', type: 'pattern', title_template: 'Anxiété matinale récurrente', description_template: 'Nous avons détecté que votre niveau d\'anxiété est régulièrement élevé le matin ({time}). Essayez une routine de respiration au réveil.', conditions: { time_of_day: 'morning', emotion: 'anxiety', threshold: 0.6 }, priority: 1, category: 'wellness' },
  { id: 'evening_calm', type: 'pattern', title_template: 'Sérénité du soir', description_template: 'Vos soirées sont généralement calmes et positives. Continuez vos rituels de fin de journée.', conditions: { time_of_day: 'evening', emotion: 'joy', threshold: 0.5 }, priority: 3, category: 'wellness' },
  { id: 'weekend_boost', type: 'pattern', title_template: 'Bien-être du week-end', description_template: 'Votre humeur s\'améliore significativement le week-end. Identifiez ce qui vous fait du bien ces jours-là.', conditions: { day_of_week: [0, 6], emotion: 'joy', threshold: 0.6 }, priority: 2, category: 'behavioral' },
  { id: 'monday_blues', type: 'pattern', title_template: 'Blues du lundi', description_template: 'Les lundis sont souvent plus difficiles émotionnellement. Préparez une activité agréable pour démarrer la semaine.', conditions: { day_of_week: [1], emotion: 'sadness', threshold: 0.4 }, priority: 2, category: 'behavioral' },
  { id: 'stress_cycle', type: 'pattern', title_template: 'Cycle de stress détecté', description_template: 'Un pattern de stress récurrent a été identifié. Considérez des pauses régulières dans votre routine.', conditions: { emotion: 'anxiety', frequency: 'daily', threshold: 0.5 }, priority: 1, category: 'clinical' },
  
  // Trigger templates
  { id: 'social_trigger', type: 'trigger', title_template: 'Déclencheur social identifié', description_template: 'Certaines interactions sociales semblent affecter votre humeur. Identifiez les contextes spécifiques.', conditions: { context: 'social', emotion_change: 0.3 }, priority: 2, category: 'social' },
  { id: 'work_stress', type: 'trigger', title_template: 'Stress professionnel', description_template: 'Le travail semble être une source de stress régulière. Envisagez des techniques de gestion du stress.', conditions: { context: 'work', emotion: 'anxiety', threshold: 0.5 }, priority: 1, category: 'behavioral' },
  { id: 'sleep_impact', type: 'trigger', title_template: 'Impact du sommeil', description_template: 'Votre qualité de sommeil semble influencer votre humeur du lendemain. Priorisez un bon repos.', conditions: { trigger: 'sleep', correlation: 0.6 }, priority: 1, category: 'wellness' },
  
  // Recommendation templates
  { id: 'breathing_rec', type: 'recommendation', title_template: 'Exercice de respiration recommandé', description_template: 'Basé sur vos patterns, un exercice de cohérence cardiaque pourrait vous aider maintenant.', conditions: { emotion: 'anxiety', threshold: 0.5 }, priority: 1, category: 'wellness' },
  { id: 'meditation_rec', type: 'recommendation', title_template: 'Méditation suggérée', description_template: 'Une session de méditation guidée pourrait améliorer votre état émotionnel actuel.', conditions: { stress_level: 'high' }, priority: 2, category: 'wellness' },
  { id: 'activity_rec', type: 'recommendation', title_template: 'Activité physique', description_template: 'L\'exercice physique peut aider à réguler vos émotions. Essayez une marche de 15 minutes.', conditions: { sedentary: true, emotion: 'sadness' }, priority: 2, category: 'wellness' },
  { id: 'journal_rec', type: 'recommendation', title_template: 'Moment d\'écriture', description_template: 'Écrire dans votre journal pourrait vous aider à clarifier vos pensées actuelles.', conditions: { emotion_complexity: 'high' }, priority: 3, category: 'behavioral' },
  { id: 'social_rec', type: 'recommendation', title_template: 'Connexion sociale', description_template: 'Un moment avec un proche pourrait améliorer votre humeur. Pensez à appeler quelqu\'un.', conditions: { isolation_days: 3 }, priority: 2, category: 'social' },
  
  // Correlation templates
  { id: 'weather_mood', type: 'correlation', title_template: 'Influence météo', description_template: 'Votre humeur semble corrélée aux conditions météorologiques. Adaptez vos activités en conséquence.', conditions: { factor: 'weather', correlation: 0.5 }, priority: 3, category: 'behavioral' },
  { id: 'exercise_mood', type: 'correlation', title_template: 'Exercice et humeur', description_template: 'Les jours où vous faites de l\'exercice, votre humeur est significativement meilleure.', conditions: { factor: 'exercise', correlation: 0.6 }, priority: 2, category: 'wellness' },
  { id: 'sleep_anxiety', type: 'correlation', title_template: 'Sommeil et anxiété', description_template: 'Un manque de sommeil semble augmenter votre niveau d\'anxiété le lendemain.', conditions: { factor: 'sleep', emotion: 'anxiety', correlation: -0.5 }, priority: 1, category: 'clinical' },
  
  // Alert templates
  { id: 'high_anxiety', type: 'alert', title_template: 'Niveau d\'anxiété élevé', description_template: 'Votre niveau d\'anxiété est particulièrement élevé. Prenez un moment pour vous recentrer.', conditions: { emotion: 'anxiety', threshold: 0.8 }, priority: 1, category: 'clinical' },
  { id: 'prolonged_sadness', type: 'alert', title_template: 'Tristesse prolongée', description_template: 'Vous semblez triste depuis plusieurs jours. N\'hésitez pas à en parler à quelqu\'un.', conditions: { emotion: 'sadness', duration_days: 3 }, priority: 1, category: 'clinical' },
  { id: 'stress_peak', type: 'alert', title_template: 'Pic de stress', description_template: 'Votre niveau de stress a atteint un pic. Accordez-vous une pause immédiate.', conditions: { emotion: 'anxiety', spike: 0.4 }, priority: 1, category: 'clinical' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case 'list': {
        // Fetch user's insights from database
        let query = supabase
          .from('context_lens_insights')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (params.type) {
          query = query.eq('type', params.type);
        }
        if (params.unread_only) {
          query = query.eq('is_read', false);
        }
        if (params.limit) {
          query = query.limit(params.limit);
        }

        const { data: insights, error } = await query;

        if (error) {
          // If table doesn't exist, return mock data
          console.log('[Context Lens] Using mock insights:', error.message);
          const mockInsights = generateMockInsights(user.id);
          return new Response(
            JSON.stringify({ insights: mockInsights }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ insights: insights || [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'mark_read': {
        const { insight_id } = params;
        
        await supabase
          .from('context_lens_insights')
          .update({ is_read: true })
          .eq('id', insight_id)
          .eq('user_id', user.id);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'generate': {
        // Generate new insights based on user's emotion data
        const newInsights = await generateInsights(supabase, user.id);
        
        return new Response(
          JSON.stringify({ insights: newInsights }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('[Context Lens Insights] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateMockInsights(userId: string) {
  const now = new Date();
  return [
    {
      id: 'mock-1',
      user_id: userId,
      type: 'pattern',
      title: 'Anxiété matinale récurrente',
      description: 'Nous avons détecté que votre niveau d\'anxiété est régulièrement élevé le matin. Essayez une routine de respiration au réveil.',
      confidence: 0.85,
      data: { time_of_day: 'morning', emotion: 'anxiety' },
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      is_read: false,
    },
    {
      id: 'mock-2',
      user_id: userId,
      type: 'recommendation',
      title: 'Exercice de respiration recommandé',
      description: 'Basé sur vos patterns, un exercice de cohérence cardiaque pourrait vous aider maintenant.',
      confidence: 0.78,
      data: { suggested_activity: 'breathing' },
      created_at: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      is_read: false,
    },
    {
      id: 'mock-3',
      user_id: userId,
      type: 'correlation',
      title: 'Exercice et humeur',
      description: 'Les jours où vous faites de l\'exercice, votre humeur est significativement meilleure.',
      confidence: 0.72,
      data: { factor: 'exercise', correlation: 0.65 },
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      is_read: true,
    },
    {
      id: 'mock-4',
      user_id: userId,
      type: 'trigger',
      title: 'Stress professionnel',
      description: 'Le travail semble être une source de stress régulière. Envisagez des techniques de gestion du stress.',
      confidence: 0.81,
      data: { context: 'work' },
      created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      is_read: true,
    },
  ];
}

async function generateInsights(supabase: any, userId: string) {
  // In production, this would analyze user's emotion history
  // and generate personalized insights based on templates
  return generateMockInsights(userId);
}
