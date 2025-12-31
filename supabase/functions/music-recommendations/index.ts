// @ts-nocheck
/**
 * Music Recommendations Edge Function
 * Génère des recommandations musicales intelligentes basées sur le contexte utilisateur
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecommendationContext {
  timeOfDay: string;
  currentActivity?: string;
  recentMood?: number;
  energyLevel?: number;
}

interface ListeningPattern {
  preferredDurations: number[];
  moodResponses: Record<string, number>;
  therapeuticEffectiveness: Record<string, number>;
  timePreferences: Record<string, number>;
}

interface HistorySummary {
  totalSessions: number;
  avgImprovement: number;
  totalListeningTime: number;
  adaptationRate: number;
}

// Bibliothèque de playlists thérapeutiques
const THERAPEUTIC_PLAYLISTS = [
  {
    id: 'morning-energy',
    name: 'Énergie Matinale',
    duration_minutes: 20,
    optimal_timing: 'morning',
    expected_benefits: ['Réveil en douceur', 'Boost d\'énergie', 'Clarté mentale'],
    reasoning: 'Musique progressive pour démarrer la journée',
    tracks: [
      { id: 'me-1', title: 'Sunrise Flow', artist: 'Wellness Studio', duration: 240, mood_target: 'energizing', energy_level: 6 },
      { id: 'me-2', title: 'Morning Motivation', artist: 'Energy Beats', duration: 300, mood_target: 'uplifting', energy_level: 7 },
      { id: 'me-3', title: 'Fresh Start', artist: 'Positive Vibes', duration: 260, mood_target: 'refreshing', energy_level: 6 }
    ]
  },
  {
    id: 'focus-deep',
    name: 'Concentration Profonde',
    duration_minutes: 45,
    optimal_timing: 'afternoon',
    expected_benefits: ['Focus amélioré', 'Productivité accrue', 'Moins de distractions'],
    reasoning: 'Ambiances minimalistes pour un travail concentré',
    tracks: [
      { id: 'fd-1', title: 'Deep Focus', artist: 'Study Vibes', duration: 600, mood_target: 'focus', energy_level: 4 },
      { id: 'fd-2', title: 'Flow State', artist: 'Productivity Sounds', duration: 480, mood_target: 'concentration', energy_level: 4 },
      { id: 'fd-3', title: 'Neural Boost', artist: 'Brain Waves', duration: 520, mood_target: 'clarity', energy_level: 5 }
    ]
  },
  {
    id: 'evening-wind-down',
    name: 'Détente du Soir',
    duration_minutes: 30,
    optimal_timing: 'evening',
    expected_benefits: ['Relaxation', 'Réduction du stress', 'Préparation au sommeil'],
    reasoning: 'Transition douce vers le calme nocturne',
    tracks: [
      { id: 'ew-1', title: 'Sunset Serenity', artist: 'Calm Collective', duration: 360, mood_target: 'relaxing', energy_level: 2 },
      { id: 'ew-2', title: 'Night Whispers', artist: 'Ambient Dreams', duration: 400, mood_target: 'soothing', energy_level: 2 },
      { id: 'ew-3', title: 'Moonlight Peace', artist: 'Sleep Sounds', duration: 380, mood_target: 'peaceful', energy_level: 1 }
    ]
  },
  {
    id: 'stress-relief',
    name: 'Soulagement du Stress',
    duration_minutes: 25,
    optimal_timing: 'anytime',
    expected_benefits: ['Apaisement immédiat', 'Réduction de l\'anxiété', 'Retour au calme'],
    reasoning: 'Combinaison apaisante pour les moments difficiles',
    tracks: [
      { id: 'sr-1', title: 'Ocean Calm', artist: 'Nature Therapy', duration: 300, mood_target: 'calming', energy_level: 2 },
      { id: 'sr-2', title: 'Breathing Space', artist: 'Zen Masters', duration: 280, mood_target: 'centering', energy_level: 2 },
      { id: 'sr-3', title: 'Inner Peace', artist: 'Meditation Sounds', duration: 320, mood_target: 'tranquil', energy_level: 1 }
    ]
  },
  {
    id: 'creative-flow',
    name: 'Flux Créatif',
    duration_minutes: 40,
    optimal_timing: 'afternoon',
    expected_benefits: ['Inspiration', 'Créativité libérée', 'Pensée fluide'],
    reasoning: 'Stimulation douce pour l\'expression créative',
    tracks: [
      { id: 'cf-1', title: 'Creative Spark', artist: 'Artistic Vibes', duration: 350, mood_target: 'inspiring', energy_level: 5 },
      { id: 'cf-2', title: 'Imagination Flow', artist: 'Dream Weavers', duration: 400, mood_target: 'creative', energy_level: 5 },
      { id: 'cf-3', title: 'Color Palette', artist: 'Abstract Sounds', duration: 380, mood_target: 'expressive', energy_level: 5 }
    ]
  },
  {
    id: 'emotional-healing',
    name: 'Guérison Émotionnelle',
    duration_minutes: 35,
    optimal_timing: 'anytime',
    expected_benefits: ['Libération émotionnelle', 'Réconfort', 'Acceptation'],
    reasoning: 'Sons thérapeutiques pour le bien-être émotionnel',
    tracks: [
      { id: 'eh-1', title: 'Gentle Embrace', artist: 'Healing Harmonies', duration: 400, mood_target: 'comforting', energy_level: 3 },
      { id: 'eh-2', title: 'Heart Opening', artist: 'Soul Sounds', duration: 380, mood_target: 'healing', energy_level: 3 },
      { id: 'eh-3', title: 'Release & Renew', artist: 'Transformation Music', duration: 420, mood_target: 'releasing', energy_level: 4 }
    ]
  }
];

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function selectRecommendations(
  context: RecommendationContext,
  patterns: ListeningPattern,
  historySummary: HistorySummary
): any[] {
  const timeOfDay = context.timeOfDay || getTimeOfDay();
  const energyLevel = context.energyLevel ?? 5;
  const recentMood = context.recentMood ?? 50;

  // Score chaque playlist
  const scored = THERAPEUTIC_PLAYLISTS.map(playlist => {
    let score = 0;

    // Bonus timing
    if (playlist.optimal_timing === timeOfDay || playlist.optimal_timing === 'anytime') {
      score += 20;
    }

    // Bonus énergie
    const avgPlaylistEnergy = playlist.tracks.reduce((sum, t) => sum + t.energy_level, 0) / playlist.tracks.length;
    if (energyLevel < 4 && avgPlaylistEnergy > 5) {
      score += 15; // Boost énergie si fatigue
    } else if (energyLevel > 7 && avgPlaylistEnergy < 3) {
      score += 10; // Calme si trop d'énergie
    }

    // Bonus humeur
    if (recentMood < 40 && playlist.id.includes('healing')) {
      score += 20;
    } else if (recentMood > 70 && playlist.id.includes('creative')) {
      score += 15;
    }

    // Bonus activité
    if (context.currentActivity === 'work' && playlist.id.includes('focus')) {
      score += 25;
    } else if (context.currentActivity === 'relax' && (playlist.id.includes('wind') || playlist.id.includes('relief'))) {
      score += 25;
    }

    // Bonus historique
    if (historySummary.totalSessions > 10) {
      score += 5; // Utilisateur régulier
    }

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map(t => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          duration: t.duration,
          therapeutic_properties: {
            mood_target: t.mood_target,
            energy_level: t.energy_level,
            stress_reduction: t.energy_level < 4 ? 0.8 : 0.4,
            emotional_resonance: 0.7
          }
        })),
        therapeutic_goal: playlist.expected_benefits[0],
        expected_mood_shift: recentMood < 50 ? 15 : 5,
        personalization_score: Math.min(0.95, 0.6 + (historySummary.totalSessions * 0.01))
      },
      reasoning: playlist.reasoning,
      expected_benefits: playlist.expected_benefits,
      optimal_timing: playlist.optimal_timing,
      duration_minutes: playlist.duration_minutes,
      score
    };
  });

  // Trier par score et retourner les 3 meilleurs
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...rest }) => rest);
}

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
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { userId, context, patterns, historySummary } = body;

    const recommendations = selectRecommendations(
      context || {},
      patterns || { preferredDurations: [], moodResponses: {}, therapeuticEffectiveness: {}, timePreferences: {} },
      historySummary || { totalSessions: 0, avgImprovement: 0, totalListeningTime: 0, adaptationRate: 0 }
    );

    return new Response(JSON.stringify({ 
      success: true,
      recommendations 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[music-recommendations] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
