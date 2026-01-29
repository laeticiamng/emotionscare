/**
 * Edge Function: implicit-assess
 * 
 * Persiste les évaluations implicites de façon transparente.
 * Les données sont collectées de manière ludique dans les modules
 * et mappées aux instruments cliniques en backend.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mapping types implicites → instruments cliniques
const IMPLICIT_TO_CLINICAL: Record<string, string> = {
  wellbeing: 'WHO5',
  anxiety: 'GAD7',
  mood: 'PHQ9',
  stress: 'PSS10',
  sleep: 'ISI',
  resilience: 'BRS',
};

// Seuils de scoring simplifiés par type
const SCORING_THRESHOLDS: Record<string, { maxScore: number; levels: number[] }> = {
  wellbeing: { maxScore: 20, levels: [4, 8, 12, 16] },  // WHO-5: 0-100 scaled
  anxiety: { maxScore: 21, levels: [5, 10, 15, 21] },   // GAD-7
  mood: { maxScore: 27, levels: [5, 10, 15, 20] },      // PHQ-9
  stress: { maxScore: 40, levels: [14, 20, 27, 40] },   // PSS-10
  sleep: { maxScore: 28, levels: [8, 15, 22, 28] },     // ISI
  resilience: { maxScore: 30, levels: [6, 12, 18, 24] }, // BRS (inversé)
};

interface ImplicitAssessRequest {
  type: string;
  answers: Record<string, number>;
  context?: {
    module?: string;      // Module source (coach, meditation, etc.)
    session_id?: string;  // ID de session si applicable
    timestamp?: string;
  };
}

function calculateLevel(type: string, totalScore: number): number {
  const thresholds = SCORING_THRESHOLDS[type];
  if (!thresholds) return 2; // Neutre par défaut
  
  for (let i = 0; i < thresholds.levels.length; i++) {
    if (totalScore <= thresholds.levels[i]) {
      return i;
    }
  }
  return 4; // Maximum
}

function generateSummary(type: string, level: number): string {
  const summaries: Record<string, string[]> = {
    wellbeing: [
      'Bien-être optimal',
      'Bon niveau de bien-être',
      'Bien-être modéré',
      'Bien-être à surveiller',
      'Accompagnement recommandé',
    ],
    anxiety: [
      'Calme et serein',
      'Légère tension',
      'Anxiété modérée',
      'Anxiété significative',
      'Accompagnement recommandé',
    ],
    mood: [
      'Humeur positive',
      'Humeur stable',
      'Quelques fluctuations',
      'Humeur basse',
      'Accompagnement recommandé',
    ],
    stress: [
      'Faible niveau de stress',
      'Stress gérable',
      'Stress modéré',
      'Stress élevé',
      'Accompagnement recommandé',
    ],
    sleep: [
      'Sommeil de qualité',
      'Bon sommeil',
      'Sommeil perturbé',
      'Difficultés de sommeil',
      'Accompagnement recommandé',
    ],
    resilience: [
      'Forte résilience',
      'Bonne résilience',
      'Résilience moyenne',
      'Résilience à renforcer',
      'Accompagnement recommandé',
    ],
  };
  
  return summaries[type]?.[level] || 'Évaluation complétée';
}

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('[implicit-assess] Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: ImplicitAssessRequest = await req.json();
    const { type, answers, context } = body;

    console.log(`[implicit-assess] User ${user.id} submitted ${type} assessment`);

    // Validation
    if (!type || !answers || Object.keys(answers).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Type and answers required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calcul du score total
    const values = Object.values(answers);
    const totalScore = values.reduce((a, b) => a + b, 0);
    const avgScore = totalScore / values.length;
    const level = calculateLevel(type, totalScore);
    const summary = generateSummary(type, level);

    // Mapper vers l'instrument clinique
    const clinicalInstrument = IMPLICIT_TO_CLINICAL[type] || type.toUpperCase();

    // Construire le score_json
    const scoreJson = {
      total: totalScore,
      average: Math.round(avgScore * 100) / 100,
      level,
      summary,
      questionsCount: values.length,
      implicitType: type,
      source: context?.module || 'implicit',
      sessionId: context?.session_id,
    };

    // Persister dans la table assessments
    const { data: assessment, error: insertError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        instrument: clinicalInstrument,
        score_json: scoreJson,
        ts: context?.timestamp || new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('[implicit-assess] Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save assessment', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[implicit-assess] Saved assessment ${assessment.id} for user ${user.id}`);

    // Réponse positive sans révéler les détails cliniques
    return new Response(
      JSON.stringify({
        status: 'ok',
        message: summary,
        level, // 0-4, utilisé pour UI uniquement
        id: assessment.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[implicit-assess] Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
