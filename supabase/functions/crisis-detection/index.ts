// @ts-nocheck
/**
 * Crisis Detection - Système de détection et intervention de crise
 * Analyse les patterns émotionnels avec ML et déclenche des alertes
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const ALLOWED_ORIGINS = [
  'https://emotionscare.com',
  'https://www.emotionscare.com',
  'https://emotions-care.lovable.app',
  'http://localhost:5173',
];

function getCorsHeaders(req) {
  const origin = req.headers.get('origin') ?? '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

interface CrisisIndicator {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  weight: number;
  confidence: number;
}

interface UserData {
  recentMoods?: Array<{ score: number; created_at: string }>;
  journalEntries?: Array<{ content: string; sentiment?: number; created_at: string }>;
  breathSessions?: Array<{ created_at: string }>;
  coachSessions?: Array<{ created_at: string; emotions_detected?: any }>;
  lastLogin?: string;
}

// Mots-clés à risque pour l'analyse de texte
const CRISIS_KEYWORDS = {
  critical: ['suicide', 'mourir', 'en finir', 'plus envie de vivre', 'me tuer'],
  high: ['désespoir', 'plus rien', 'abandonner', 'inutile', 'personne ne comprend'],
  medium: ['épuisé', 'seul', 'vide', 'triste', 'anxieux', 'peur']
};

// Analyse ML-like des patterns utilisateur
function analyzeUserPatterns(data: UserData): CrisisIndicator[] {
  const indicators: CrisisIndicator[] = [];
  const now = new Date();

  // 1. Analyse des humeurs avec détection de tendance
  if (data.recentMoods && data.recentMoods.length >= 3) {
    const moods = data.recentMoods.slice(0, 7);
    const avgMood = moods.reduce((sum, m) => sum + m.score, 0) / moods.length;
    
    // Régression linéaire simple pour détecter la tendance
    const trend = calculateTrend(moods.map((m, i) => ({ x: i, y: m.score })));
    
    if (avgMood <= 2) {
      indicators.push({
        type: 'persistent_low_mood',
        severity: avgMood <= 1 ? 'critical' : 'high',
        description: `Humeur très basse persistante (${avgMood.toFixed(1)}/10)`,
        weight: avgMood <= 1 ? 0.45 : 0.30,
        confidence: 0.85
      });
    }

    // Tendance négative forte
    if (trend < -0.5 && moods.length >= 5) {
      indicators.push({
        type: 'declining_mood_trend',
        severity: 'high',
        description: 'Tendance négative marquée sur les derniers jours',
        weight: 0.35,
        confidence: 0.80
      });
    }

    // Chute brutale
    if (moods.length >= 2) {
      const drops = [];
      for (let i = 1; i < moods.length; i++) {
        const drop = moods[i-1].score - moods[i].score;
        if (drop >= 4) drops.push(drop);
      }
      if (drops.length > 0) {
        const maxDrop = Math.max(...drops);
        indicators.push({
          type: 'sudden_mood_drop',
          severity: maxDrop >= 6 ? 'critical' : 'high',
          description: `Chute soudaine d'humeur (-${maxDrop} points)`,
          weight: maxDrop >= 6 ? 0.40 : 0.30,
          confidence: 0.90
        });
      }
    }

    // Volatilité émotionnelle
    const variance = calculateVariance(moods.map(m => m.score));
    if (variance > 6) {
      indicators.push({
        type: 'emotional_volatility',
        severity: 'medium',
        description: 'Forte volatilité émotionnelle détectée',
        weight: 0.20,
        confidence: 0.75
      });
    }
  }

  // 2. Analyse du contenu journal avec NLP simplifié
  if (data.journalEntries && data.journalEntries.length > 0) {
    const recentEntries = data.journalEntries.slice(0, 5);
    let criticalKeywordCount = 0;
    let highKeywordCount = 0;
    let mediumKeywordCount = 0;

    for (const entry of recentEntries) {
      const content = entry.content.toLowerCase();
      CRISIS_KEYWORDS.critical.forEach(kw => {
        if (content.includes(kw)) criticalKeywordCount++;
      });
      CRISIS_KEYWORDS.high.forEach(kw => {
        if (content.includes(kw)) highKeywordCount++;
      });
      CRISIS_KEYWORDS.medium.forEach(kw => {
        if (content.includes(kw)) mediumKeywordCount++;
      });
    }

    if (criticalKeywordCount > 0) {
      indicators.push({
        type: 'crisis_language_detected',
        severity: 'critical',
        description: 'Expressions préoccupantes détectées dans le journal',
        weight: 0.50,
        confidence: 0.95
      });
    } else if (highKeywordCount >= 3) {
      indicators.push({
        type: 'distress_language_pattern',
        severity: 'high',
        description: 'Signes de détresse dans les écrits récents',
        weight: 0.35,
        confidence: 0.80
      });
    } else if (mediumKeywordCount >= 5) {
      indicators.push({
        type: 'negative_language_pattern',
        severity: 'medium',
        description: 'Tonalité négative persistante dans le journal',
        weight: 0.20,
        confidence: 0.70
      });
    }
  }

  // 3. Analyse de l'engagement avec l'app
  const daysSinceLogin = data.lastLogin 
    ? Math.floor((now.getTime() - new Date(data.lastLogin).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (daysSinceLogin >= 14) {
    indicators.push({
      type: 'prolonged_disengagement',
      severity: 'high',
      description: `Absence prolongée (${daysSinceLogin} jours)`,
      weight: 0.30,
      confidence: 0.65
    });
  } else if (daysSinceLogin >= 7) {
    indicators.push({
      type: 'disengagement',
      severity: 'medium',
      description: `Inactif depuis ${daysSinceLogin} jours`,
      weight: 0.15,
      confidence: 0.60
    });
  }

  // 4. Analyse des activités de coping
  const hasRecentBreathing = data.breathSessions && data.breathSessions.length > 0;
  const hasRecentCoaching = data.coachSessions && data.coachSessions.length > 0;

  if (!hasRecentBreathing && !hasRecentCoaching) {
    indicators.push({
      type: 'no_coping_activities',
      severity: 'low',
      description: 'Aucune activité de gestion du stress récente',
      weight: 0.10,
      confidence: 0.55
    });
  }

  // 5. Analyse des émotions détectées dans les sessions coach
  if (data.coachSessions && data.coachSessions.length > 0) {
    const recentEmotions = data.coachSessions
      .filter(s => s.emotions_detected)
      .flatMap(s => s.emotions_detected as string[]);
    
    const negativeEmotions = ['anxiété', 'tristesse', 'colère', 'peur', 'désespoir'];
    const negativeCount = recentEmotions.filter(e => 
      negativeEmotions.some(ne => e.toLowerCase().includes(ne))
    ).length;

    if (negativeCount >= 5) {
      indicators.push({
        type: 'persistent_negative_emotions',
        severity: 'medium',
        description: 'Émotions négatives persistantes dans les sessions',
        weight: 0.25,
        confidence: 0.75
      });
    }
  }

  return indicators;
}

function calculateTrend(points: Array<{ x: number; y: number }>): number {
  if (points.length < 2) return 0;
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}

function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  return values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length;
}

function calculateCrisisScore(indicators: CrisisIndicator[]): { score: number; confidence: number } {
  if (indicators.length === 0) return { score: 0, confidence: 0 };
  
  const weightedScore = indicators.reduce((sum, i) => sum + (i.weight * 100 * i.confidence), 0);
  const avgConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
  
  return {
    score: Math.min(100, weightedScore),
    confidence: avgConfidence
  };
}

function generateRecommendations(score: number, indicators: CrisisIndicator[]): string[] {
  const hasCritical = indicators.some(i => i.severity === 'critical');
  const hasHigh = indicators.some(i => i.severity === 'high');

  if (hasCritical || score >= 70) {
    return [
      '🆘 Appelez le 3114 (numéro national de prévention du suicide) - disponible 24h/24',
      '👥 Parlez immédiatement à un proche de confiance',
      '🏥 Rendez-vous aux urgences psychiatriques si vous êtes en danger',
      '📞 Contactez SOS Amitié au 09 72 39 40 50'
    ];
  } else if (hasHigh || score >= 50) {
    return [
      '🗣️ Parlez à un professionnel de santé mentale',
      '📅 Prenez rendez-vous avec un psychologue via Doctolib',
      '💆 Pratiquez des exercices de respiration guidée',
      '📝 Continuez à tenir votre journal émotionnel',
      '👥 Contactez un proche de confiance'
    ];
  } else {
    return [
      '🧘 Continuez vos exercices de respiration régulièrement',
      '📝 Tenez votre journal émotionnel quotidiennement',
      '🚶 Maintenez une activité physique légère',
      '😴 Veillez à avoir un sommeil régulier',
      '🤝 Restez en contact avec vos proches'
    ];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    const { action } = await req.json();

    if (action === 'analyze') {
      console.log('[crisis-detection] Analyzing user:', user.id);

      // Récupérer toutes les données utilisateur
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      
      const [moodsResult, journalResult, breathResult, coachResult] = await Promise.all([
        supabaseClient.from('moods')
          .select('score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(14),
        supabaseClient.from('journal_entries')
          .select('content, created_at')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo)
          .order('created_at', { ascending: false }),
        supabaseClient.from('breathing_vr_sessions')
          .select('created_at')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo),
        supabaseClient.from('ai_coach_sessions')
          .select('created_at, emotions_detected')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo)
      ]);

      const indicators = analyzeUserPatterns({
        recentMoods: moodsResult.data || [],
        journalEntries: journalResult.data || [],
        breathSessions: breathResult.data || [],
        coachSessions: coachResult.data || [],
        lastLogin: new Date().toISOString()
      });

      const { score, confidence } = calculateCrisisScore(indicators);
      const needsIntervention = score >= 50;
      const recommendations = generateRecommendations(score, indicators);

      console.log('[crisis-detection] Score:', score, 'Confidence:', confidence, 'Indicators:', indicators.length);

      // Si score élevé, créer une alerte
      if (needsIntervention) {
        await supabaseAdmin.from('crisis_alerts').insert({
          user_id: user.id,
          crisis_score: score,
          indicators: indicators,
          confidence: confidence,
          status: 'pending',
          detected_at: new Date().toISOString()
        }).catch(e => console.error('[crisis-detection] Alert insert error:', e));
      }

      return new Response(JSON.stringify({
        crisisScore: Math.round(score),
        confidence: Math.round(confidence * 100),
        indicators: indicators.map(i => ({
          type: i.type,
          severity: i.severity,
          description: i.description
        })),
        needsIntervention,
        urgencyLevel: score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : 'low',
        recommendations
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (action === 'acknowledge') {
      await supabaseClient.from('crisis_alerts')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('status', 'pending');

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_resources') {
      return new Response(JSON.stringify({
        emergency: [
          { name: 'Numéro national de prévention du suicide', number: '3114', available: '24h/24', priority: 1 },
          { name: 'SAMU', number: '15', available: '24h/24', priority: 2 },
          { name: 'SOS Amitié', number: '09 72 39 40 50', available: '24h/24', priority: 3 }
        ],
        support: [
          { name: 'Fil Santé Jeunes', number: '0 800 235 236', available: '9h-23h' },
          { name: 'SOS Dépression', number: '01 45 39 40 00', available: 'Lun-Ven 10h-17h' },
          { name: 'Croix-Rouge Écoute', number: '0 800 858 858', available: '24h/24' }
        ],
        online: [
          { name: 'Doctolib - Psychologues', url: 'https://www.doctolib.fr/psychologue' },
          { name: 'Psycom - Information santé mentale', url: 'https://www.psycom.org' },
          { name: 'Mon soutien psy', url: 'https://www.ameli.fr/assure/remboursements/rembourse/dispositif-mon-soutien-psy' }
        ]
      }), {
        headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Action non reconnue' }), {
      status: 400,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[crisis-detection] Error:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});
