// @ts-nocheck
/**
 * Crisis Detection - Système de détection et intervention de crise
 * Analyse les patterns émotionnels et déclenche des alertes si nécessaire
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CrisisIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  weight: number;
}

// Indicateurs de crise basés sur les données utilisateur
function analyzeUserData(data: {
  recentMoods?: Array<{ score: number; created_at: string }>;
  journalEntries?: Array<{ content: string; sentiment?: number; created_at: string }>;
  breathSessions?: Array<{ created_at: string }>;
  lastLogin?: string;
}): CrisisIndicator[] {
  const indicators: CrisisIndicator[] = [];
  const now = new Date();

  // Analyse des humeurs récentes
  if (data.recentMoods && data.recentMoods.length >= 3) {
    const avgMood = data.recentMoods.slice(0, 5).reduce((sum, m) => sum + m.score, 0) / Math.min(5, data.recentMoods.length);
    
    if (avgMood <= 2) {
      indicators.push({
        type: 'low_mood_trend',
        severity: avgMood <= 1 ? 'high' : 'medium',
        description: `Humeur moyenne très basse (${avgMood.toFixed(1)}/10) sur les derniers jours`,
        weight: avgMood <= 1 ? 0.4 : 0.25
      });
    }

    // Détection de chute brutale
    if (data.recentMoods.length >= 2) {
      const latest = data.recentMoods[0].score;
      const previous = data.recentMoods[1].score;
      if (previous - latest >= 5) {
        indicators.push({
          type: 'mood_drop',
          severity: 'high',
          description: `Chute brutale d'humeur (-${previous - latest} points)`,
          weight: 0.35
        });
      }
    }
  }

  // Analyse de l'inactivité
  if (data.lastLogin) {
    const daysSinceLogin = Math.floor((now.getTime() - new Date(data.lastLogin).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLogin >= 7) {
      indicators.push({
        type: 'inactivity',
        severity: daysSinceLogin >= 14 ? 'medium' : 'low',
        description: `Inactif depuis ${daysSinceLogin} jours`,
        weight: daysSinceLogin >= 14 ? 0.2 : 0.1
      });
    }
  }

  // Analyse des sessions de respiration (indicateur positif si présent)
  if (data.breathSessions && data.breathSessions.length === 0) {
    indicators.push({
      type: 'no_coping_activities',
      severity: 'low',
      description: 'Aucune activité de gestion du stress récente',
      weight: 0.1
    });
  }

  return indicators;
}

function calculateCrisisScore(indicators: CrisisIndicator[]): number {
  if (indicators.length === 0) return 0;
  return Math.min(100, indicators.reduce((sum, i) => sum + (i.weight * 100), 0));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action } = await req.json();

    if (action === 'analyze') {
      // Récupérer les données utilisateur pour l'analyse
      const [moodsResult, sessionsResult] = await Promise.all([
        supabaseClient
          .from('moods')
          .select('score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabaseClient
          .from('breath_sessions')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const indicators = analyzeUserData({
        recentMoods: moodsResult.data || [],
        breathSessions: sessionsResult.data || [],
        lastLogin: new Date().toISOString()
      });

      const crisisScore = calculateCrisisScore(indicators);
      const needsIntervention = crisisScore >= 50;

      // Si score élevé, créer une alerte
      if (needsIntervention) {
        await supabaseAdmin.from('crisis_alerts').insert({
          user_id: user.id,
          crisis_score: crisisScore,
          indicators: indicators,
          status: 'pending',
          detected_at: new Date().toISOString()
        }).catch(() => {});
      }

      return new Response(JSON.stringify({
        crisisScore,
        indicators,
        needsIntervention,
        recommendations: needsIntervention ? [
          'Contactez le 3114 (numéro national de prévention du suicide)',
          'Parlez à un proche de confiance',
          'Consultez un professionnel de santé mentale'
        ] : [
          'Continuez vos exercices de respiration',
          'Tenez votre journal régulièrement',
          'Maintenez une routine de bien-être'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'acknowledge') {
      // L'utilisateur reconnaît avoir vu l'alerte
      await supabaseClient.from('crisis_alerts')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_resources') {
      return new Response(JSON.stringify({
        emergency: [
          { name: 'Numéro national de prévention du suicide', number: '3114', available: '24h/24' },
          { name: 'SAMU', number: '15', available: '24h/24' },
          { name: 'SOS Amitié', number: '09 72 39 40 50', available: '24h/24' }
        ],
        support: [
          { name: 'Fil Santé Jeunes', number: '0 800 235 236', available: '9h-23h' },
          { name: 'SOS Dépression', number: '01 45 39 40 00', available: 'Lun-Ven 10h-17h' }
        ],
        online: [
          { name: 'Doctolib - Psychologues', url: 'https://www.doctolib.fr/psychologue' },
          { name: 'Psycom - Information santé mentale', url: 'https://www.psycom.org' }
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[crisis-detection] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
