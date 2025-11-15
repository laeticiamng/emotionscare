/**
 * Music Unified - Capability Therapeutic
 * Fonctionnalités de musicothérapie
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  TherapeuticPlaylist,
  MusicTrack,
  MusicalMood,
  PlaylistGenerationConfig,
  ListeningPatterns,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Générer une playlist thérapeutique personnalisée
 */
export async function generateTherapeuticPlaylist(
  userId: string,
  config: PlaylistGenerationConfig
): Promise<TherapeuticPlaylist> {
  // Récupérer l'historique et patterns d'écoute
  const history = await fetchSessionHistory(userId, 20);
  const patterns = await analyzeListeningPatterns(history);

  // Appeler l'edge function pour génération IA
  const { data, error } = await supabase.functions.invoke('generate-therapeutic-music', {
    body: {
      userId,
      config,
      patterns,
      history: history.slice(0, 5),
    },
  });

  if (error) {
    // Fallback : générer playlist par défaut
    return generateDefaultPlaylist(config);
  }

  const now = new Date().toISOString();
  const tracks = data.tracks as MusicTrack[];
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration_seconds, 0);

  return {
    id: uuidv4(),
    name: data.name || 'Playlist thérapeutique',
    description: data.description,
    tracks,
    therapeutic_goal: config.therapeutic_goal.emotional_state,
    expected_mood_shift: calculateExpectedMoodShift(
      config.therapeutic_goal.current_mood,
      config.therapeutic_goal.target_mood
    ),
    personalization_score: data.personalizationScore || 0.85,
    user_preferences_applied: extractAppliedPreferences(config),
    created_at: now,
    duration_total_seconds: totalDuration,
    difficulty_level: config.therapeutic_goal.intensity
      ? Math.round(config.therapeutic_goal.intensity * 10)
      : 5,
  };
}

/**
 * Générer une playlist par défaut (fallback)
 */
function generateDefaultPlaylist(config: PlaylistGenerationConfig): TherapeuticPlaylist {
  const now = new Date().toISOString();

  // Créer des pistes par défaut basées sur l'objectif
  const tracks: MusicTrack[] = [
    {
      id: uuidv4(),
      title: 'Therapeutic Track 1',
      artist: 'EmotionsCare',
      duration_seconds: 240,
      therapeutic_properties: {
        mood_target: config.therapeutic_goal.target_mood.primary,
        energy_level: config.therapeutic_goal.target_mood.energy,
        stress_reduction: 0.7,
        emotional_resonance: 0.8,
        tempo_bpm: 80,
        mode: 'major',
      },
    },
    {
      id: uuidv4(),
      title: 'Therapeutic Track 2',
      artist: 'EmotionsCare',
      duration_seconds: 300,
      therapeutic_properties: {
        mood_target: config.therapeutic_goal.target_mood.primary,
        energy_level: config.therapeutic_goal.target_mood.energy,
        stress_reduction: 0.8,
        emotional_resonance: 0.7,
        tempo_bpm: 75,
        mode: 'major',
      },
    },
  ];

  return {
    id: uuidv4(),
    name: `Playlist pour ${config.therapeutic_goal.emotional_state}`,
    description: 'Playlist thérapeutique générée automatiquement',
    tracks,
    therapeutic_goal: config.therapeutic_goal.emotional_state,
    expected_mood_shift: calculateExpectedMoodShift(
      config.therapeutic_goal.current_mood,
      config.therapeutic_goal.target_mood
    ),
    personalization_score: 0.5,
    user_preferences_applied: [],
    created_at: now,
    duration_total_seconds: 540,
    difficulty_level: 5,
  };
}

/**
 * Calculer le changement d'humeur attendu
 */
function calculateExpectedMoodShift(current: MusicalMood, target: MusicalMood): number {
  // Calculer la différence de valence
  return target.valence - current.valence;
}

/**
 * Extraire les préférences appliquées
 */
function extractAppliedPreferences(config: PlaylistGenerationConfig): string[] {
  const applied: string[] = [];

  if (config.preferences?.genres && config.preferences.genres.length > 0) {
    applied.push(`Genres: ${config.preferences.genres.join(', ')}`);
  }

  if (config.preferences?.tempo_range) {
    applied.push(
      `Tempo: ${config.preferences.tempo_range.min}-${config.preferences.tempo_range.max} BPM`
    );
  }

  if (config.context?.time_of_day) {
    applied.push(`Heure: ${config.context.time_of_day}`);
  }

  if (config.context?.activity) {
    applied.push(`Activité: ${config.context.activity}`);
  }

  return applied;
}

/**
 * Récupérer l'historique des sessions
 */
async function fetchSessionHistory(userId: string, limit: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('music_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

/**
 * Analyser les patterns d'écoute
 */
async function analyzeListeningPatterns(history: any[]): Promise<ListeningPatterns> {
  if (history.length === 0) {
    return {
      favorite_genres: [],
      favorite_artists: [],
      preferred_tempo_range: { min: 60, max: 120 },
      preferred_energy_level: 0.5,
      average_session_duration: 600,
      most_effective_times: [],
      mood_improvement_average: 0,
    };
  }

  // Calculer durée moyenne
  const totalDuration = history.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
  const averageDuration = Math.round(totalDuration / history.length);

  // Calculer amélioration d'humeur moyenne
  const moodImprovements = history
    .filter((s) => s.mood_before !== null && s.mood_after !== null)
    .map((s) => s.mood_after - s.mood_before);

  const avgMoodImprovement =
    moodImprovements.length > 0
      ? moodImprovements.reduce((a, b) => a + b, 0) / moodImprovements.length
      : 0;

  return {
    favorite_genres: [],
    favorite_artists: [],
    preferred_tempo_range: { min: 60, max: 120 },
    preferred_energy_level: 0.6,
    average_session_duration: averageDuration,
    most_effective_times: ['evening', 'night'],
    mood_improvement_average: avgMoodImprovement,
  };
}

/**
 * Obtenir une recommandation de playlist
 */
export async function getPlaylistRecommendation(
  userId: string,
  currentMood: MusicalMood,
  targetMood: MusicalMood,
  emotionalState: string
): Promise<{
  playlist: TherapeuticPlaylist;
  reasoning: string;
  expected_benefits: string[];
  optimal_timing: string;
}> {
  const config: PlaylistGenerationConfig = {
    therapeutic_goal: {
      current_mood: currentMood,
      target_mood: targetMood,
      emotional_state: emotionalState,
      intensity: Math.abs(targetMood.valence - currentMood.valence),
    },
    context: {
      time_of_day: getTimeOfDay(),
    },
  };

  const playlist = await generateTherapeuticPlaylist(userId, config);

  return {
    playlist,
    reasoning: generateReasoning(currentMood, targetMood, emotionalState),
    expected_benefits: generateExpectedBenefits(targetMood),
    optimal_timing: getOptimalTiming(targetMood),
  };
}

/**
 * Obtenir l'heure de la journée
 */
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

/**
 * Générer le raisonnement
 */
function generateReasoning(
  current: MusicalMood,
  target: MusicalMood,
  state: string
): string {
  const moodShift = target.valence - current.valence;

  if (moodShift > 0.3) {
    return `Cette playlist est conçue pour élever votre humeur de "${current.primary}" vers "${target.primary}", avec une progression douce et adaptée.`;
  } else if (moodShift < -0.3) {
    return `Cette playlist aide à apaiser et calmer, en transition de "${current.primary}" vers "${target.primary}".`;
  } else {
    return `Cette playlist maintient et renforce votre état "${state}" actuel.`;
  }
}

/**
 * Générer les bénéfices attendus
 */
function generateExpectedBenefits(target: MusicalMood): string[] {
  const benefits: string[] = [];

  if (target.energy > 0.7) {
    benefits.push('Augmentation de l\'énergie');
    benefits.push('Stimulation de la motivation');
  } else if (target.energy < 0.3) {
    benefits.push('Relaxation profonde');
    benefits.push('Réduction du stress');
  }

  if (target.valence > 0.5) {
    benefits.push('Amélioration de l\'humeur');
    benefits.push('Sentiment de bien-être');
  } else if (target.valence < -0.3) {
    benefits.push('Accueil des émotions difficiles');
    benefits.push('Soutien émotionnel');
  }

  return benefits.slice(0, 4);
}

/**
 * Obtenir le timing optimal
 */
function getOptimalTiming(target: MusicalMood): string {
  if (target.energy > 0.7) {
    return 'Matin ou début d\'après-midi';
  } else if (target.energy < 0.3) {
    return 'Soirée ou avant le coucher';
  } else {
    return 'À tout moment de la journée';
  }
}
