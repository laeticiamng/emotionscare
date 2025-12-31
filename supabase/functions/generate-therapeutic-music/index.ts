// @ts-nocheck
/**
 * Generate Therapeutic Music Edge Function
 * Génère des playlists thérapeutiques personnalisées avec IA
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TherapeuticGoal {
  currentMood: number;
  targetMood: number;
  emotionalState: string;
  preferences?: string[];
  sessionDuration?: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  therapeutic_properties: {
    mood_target: string;
    energy_level: number;
    stress_reduction: number;
    emotional_resonance: number;
  };
}

// Bibliothèque de tracks thérapeutiques catégorisées
const THERAPEUTIC_TRACKS: Record<string, Track[]> = {
  calming: [
    { id: 'calm-1', title: 'Océan Paisible', artist: 'Nature Sounds', duration: 300, therapeutic_properties: { mood_target: 'calm', energy_level: 2, stress_reduction: 0.9, emotional_resonance: 0.8 } },
    { id: 'calm-2', title: 'Pluie Douce', artist: 'Ambient Dreams', duration: 360, therapeutic_properties: { mood_target: 'peaceful', energy_level: 1, stress_reduction: 0.95, emotional_resonance: 0.7 } },
    { id: 'calm-3', title: 'Forêt Zen', artist: 'Nature Therapy', duration: 420, therapeutic_properties: { mood_target: 'serene', energy_level: 2, stress_reduction: 0.85, emotional_resonance: 0.8 } },
    { id: 'calm-4', title: 'Méditation Douce', artist: 'Wellness Studio', duration: 380, therapeutic_properties: { mood_target: 'centered', energy_level: 1, stress_reduction: 0.9, emotional_resonance: 0.85 } },
  ],
  energizing: [
    { id: 'energy-1', title: 'Sunrise Power', artist: 'Energy Beats', duration: 240, therapeutic_properties: { mood_target: 'energized', energy_level: 7, stress_reduction: 0.3, emotional_resonance: 0.7 } },
    { id: 'energy-2', title: 'Motivation Flow', artist: 'Uplifting Vibes', duration: 280, therapeutic_properties: { mood_target: 'motivated', energy_level: 8, stress_reduction: 0.2, emotional_resonance: 0.75 } },
    { id: 'energy-3', title: 'Positive Rush', artist: 'Happy Beats', duration: 220, therapeutic_properties: { mood_target: 'uplifted', energy_level: 8, stress_reduction: 0.25, emotional_resonance: 0.8 } },
    { id: 'energy-4', title: 'Victory Anthem', artist: 'Power Music', duration: 260, therapeutic_properties: { mood_target: 'triumphant', energy_level: 9, stress_reduction: 0.2, emotional_resonance: 0.85 } },
  ],
  focusing: [
    { id: 'focus-1', title: 'Deep Focus', artist: 'Study Vibes', duration: 600, therapeutic_properties: { mood_target: 'focused', energy_level: 4, stress_reduction: 0.5, emotional_resonance: 0.6 } },
    { id: 'focus-2', title: 'Neural Boost', artist: 'Brain Waves', duration: 480, therapeutic_properties: { mood_target: 'concentrated', energy_level: 5, stress_reduction: 0.4, emotional_resonance: 0.5 } },
    { id: 'focus-3', title: 'Flow State', artist: 'Productivity Sounds', duration: 540, therapeutic_properties: { mood_target: 'flow', energy_level: 5, stress_reduction: 0.45, emotional_resonance: 0.55 } },
    { id: 'focus-4', title: 'Clarity Zone', artist: 'Mind Music', duration: 520, therapeutic_properties: { mood_target: 'clear', energy_level: 4, stress_reduction: 0.5, emotional_resonance: 0.6 } },
  ],
  healing: [
    { id: 'heal-1', title: 'Gentle Embrace', artist: 'Healing Harmonies', duration: 400, therapeutic_properties: { mood_target: 'comforted', energy_level: 3, stress_reduction: 0.8, emotional_resonance: 0.9 } },
    { id: 'heal-2', title: 'Heart Opening', artist: 'Soul Sounds', duration: 380, therapeutic_properties: { mood_target: 'open', energy_level: 3, stress_reduction: 0.75, emotional_resonance: 0.95 } },
    { id: 'heal-3', title: 'Release & Renew', artist: 'Transformation', duration: 420, therapeutic_properties: { mood_target: 'released', energy_level: 4, stress_reduction: 0.7, emotional_resonance: 0.9 } },
    { id: 'heal-4', title: 'Inner Peace', artist: 'Zen Masters', duration: 360, therapeutic_properties: { mood_target: 'peaceful', energy_level: 2, stress_reduction: 0.85, emotional_resonance: 0.85 } },
  ],
  joyful: [
    { id: 'joy-1', title: 'Sunshine Morning', artist: 'Happy Vibes', duration: 240, therapeutic_properties: { mood_target: 'joyful', energy_level: 7, stress_reduction: 0.4, emotional_resonance: 0.85 } },
    { id: 'joy-2', title: 'Celebration', artist: 'Uplifting Beats', duration: 210, therapeutic_properties: { mood_target: 'celebrating', energy_level: 8, stress_reduction: 0.3, emotional_resonance: 0.9 } },
    { id: 'joy-3', title: 'Pure Happiness', artist: 'Feel Good Music', duration: 230, therapeutic_properties: { mood_target: 'happy', energy_level: 7, stress_reduction: 0.35, emotional_resonance: 0.9 } },
    { id: 'joy-4', title: 'Blissful Moment', artist: 'Positive Energy', duration: 250, therapeutic_properties: { mood_target: 'blissful', energy_level: 6, stress_reduction: 0.4, emotional_resonance: 0.85 } },
  ]
};

function mapEmotionalStateToCategory(emotionalState: string): string {
  const stateMap: Record<string, string> = {
    'calm': 'calming',
    'calme': 'calming',
    'peaceful': 'calming',
    'serene': 'calming',
    'stressed': 'calming',
    'anxious': 'calming',
    'stress': 'calming',
    'anxiété': 'calming',
    'energetic': 'energizing',
    'tired': 'energizing',
    'fatigue': 'energizing',
    'fatigué': 'energizing',
    'low_energy': 'energizing',
    'focused': 'focusing',
    'focus': 'focusing',
    'concentration': 'focusing',
    'working': 'focusing',
    'sad': 'healing',
    'tristesse': 'healing',
    'triste': 'healing',
    'grief': 'healing',
    'healing': 'healing',
    'emotional': 'healing',
    'happy': 'joyful',
    'joyful': 'joyful',
    'joie': 'joyful',
    'excited': 'joyful',
    'celebratory': 'joyful'
  };

  return stateMap[emotionalState.toLowerCase()] || 'calming';
}

function selectTracksForGoal(goal: TherapeuticGoal, listeningPatterns: any): Track[] {
  const category = mapEmotionalStateToCategory(goal.emotionalState);
  const baseTracks = THERAPEUTIC_TRACKS[category] || THERAPEUTIC_TRACKS.calming;
  
  const targetDuration = (goal.sessionDuration || 30) * 60; // En secondes
  const moodDelta = goal.targetMood - goal.currentMood;
  
  // Si l'utilisateur veut améliorer son humeur, mixer avec des tracks joyeuses
  let selectedTracks: Track[] = [...baseTracks];
  
  if (moodDelta > 20 && category !== 'joyful') {
    // Ajouter des tracks énergisantes/joyeuses pour améliorer l'humeur
    selectedTracks = [
      ...baseTracks.slice(0, 2),
      ...THERAPEUTIC_TRACKS.joyful.slice(0, 2)
    ];
  } else if (moodDelta < -10) {
    // Ajouter des tracks apaisantes si l'utilisateur veut se calmer
    selectedTracks = [
      ...baseTracks.slice(0, 2),
      ...THERAPEUTIC_TRACKS.calming.slice(0, 2)
    ];
  }

  // Ajuster selon les préférences
  if (goal.preferences && goal.preferences.length > 0) {
    const prefLower = goal.preferences.map(p => p.toLowerCase());
    if (prefLower.includes('instrumental') || prefLower.includes('ambient')) {
      // Favoriser les tracks calmes
      selectedTracks = [...selectedTracks, ...THERAPEUTIC_TRACKS.calming.slice(0, 1)];
    }
  }

  // Limiter à la durée cible
  let totalDuration = 0;
  const finalTracks: Track[] = [];
  
  for (const track of selectedTracks) {
    if (totalDuration + track.duration <= targetDuration + 120) { // +2 min de marge
      finalTracks.push(track);
      totalDuration += track.duration;
    }
  }

  return finalTracks;
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
    const { userId, therapeuticGoal, listeningPatterns, history } = body;

    if (!therapeuticGoal) {
      return new Response(JSON.stringify({ error: 'therapeuticGoal requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tracks = selectTracksForGoal(therapeuticGoal, listeningPatterns || {});
    const playlistId = `therapeutic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculer le score de personnalisation basé sur l'historique
    const historyLength = Array.isArray(history) ? history.length : 0;
    const personalizationScore = Math.min(0.95, 0.6 + (historyLength * 0.02));

    const playlist = {
      playlistId,
      name: `Playlist ${therapeuticGoal.emotionalState}`,
      tracks,
      therapeuticGoal: therapeuticGoal.emotionalState,
      expectedMoodShift: therapeuticGoal.targetMood - therapeuticGoal.currentMood,
      personalizationScore,
      totalDuration: tracks.reduce((sum, t) => sum + t.duration, 0),
      createdAt: new Date().toISOString()
    };

    // Optionnel: sauvegarder la playlist dans la base
    try {
      await supabaseClient
        .from('music_playlists')
        .insert({
          id: playlistId,
          user_id: user.id,
          name: playlist.name,
          description: `Playlist thérapeutique générée pour ${therapeuticGoal.emotionalState}`,
          track_ids: tracks.map(t => t.id),
          metadata: {
            therapeutic: true,
            goal: therapeuticGoal,
            personalizationScore
          }
        });
    } catch (dbError) {
      console.log('[generate-therapeutic-music] Could not save playlist to DB:', dbError);
      // Continue anyway - playlist is still usable
    }

    return new Response(JSON.stringify({ 
      success: true,
      ...playlist
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[generate-therapeutic-music] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
