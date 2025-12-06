/**
 * Music Unified - Capability Blending
 * Fonctionnalités de mélange émotionnel (mood-mixer)
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type {
  EmotionComponent,
  MixingStrategy,
  EmotionBlend,
  EmotionalSliders,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Couleurs associées aux émotions
 */
const EMOTION_COLORS: Record<string, string> = {
  happy: '#FFD700',
  calm: '#87CEEB',
  anxious: '#FF6B6B',
  sad: '#4682B4',
  excited: '#FF4500',
  peaceful: '#98D8C8',
  angry: '#DC143C',
  content: '#F4A460',
  stressed: '#FF8C00',
  joyful: '#FFD700',
};

/**
 * Fréquences audio associées aux émotions (Hz)
 */
const EMOTION_FREQUENCIES: Record<string, number> = {
  happy: 528,      // Fréquence de l'amour
  calm: 396,       // Libération de la peur
  anxious: 639,    // Connexion et relations
  sad: 417,        // Facilitation du changement
  excited: 741,    // Expression et solutions
  peaceful: 432,   // Harmonie universelle
  angry: 852,      // Retour à l'ordre spirituel
  content: 528,
  stressed: 396,
  joyful: 528,
};

/**
 * Créer un mélange émotionnel personnalisé
 */
export async function createPersonalizedMix(
  userId: string,
  config: {
    currentEmotions: string[];
    targetEmotion: string;
    intensity?: number;
    therapeuticGoal?: string;
  }
): Promise<{
  name: string;
  description: string;
  emotions: EmotionComponent[];
  strategy: MixingStrategy;
  expected_duration: number;
  difficulty_level: number;
}> {
  // Récupérer profil et historique
  const profile = await getUserEmotionalProfile(userId);
  const history = await fetchBlendingHistory(userId, 10);

  // Tenter d'obtenir un mix IA
  const { data, error } = await supabase.functions.invoke('create-mood-mix', {
    body: {
      userId,
      config,
      profile,
      history: history.slice(0, 3),
    },
  });

  if (error || !data) {
    // Fallback : générer mix par défaut
    return generateDefaultMix(config);
  }

  return data.mix;
}

/**
 * Générer un mix par défaut
 */
function generateDefaultMix(config: {
  currentEmotions: string[];
  targetEmotion: string;
  intensity?: number;
  therapeuticGoal?: string;
}): {
  name: string;
  description: string;
  emotions: EmotionComponent[];
  strategy: MixingStrategy;
  expected_duration: number;
  difficulty_level: number;
} {
  const emotions: EmotionComponent[] = config.currentEmotions.map((emotion, index) => ({
    emotion,
    intensity: (config.intensity || 0.6) + index * 0.1,
    color: getEmotionColor(emotion),
    audio_frequency: getEmotionFrequency(emotion),
    therapeutic_value: 0.7,
  }));

  // Ajouter l'émotion cible
  emotions.push({
    emotion: config.targetEmotion,
    intensity: 0.3, // Commence faible
    color: getEmotionColor(config.targetEmotion),
    audio_frequency: getEmotionFrequency(config.targetEmotion),
    therapeutic_value: 0.9,
  });

  const strategy: MixingStrategy = {
    algorithm: 'gradual',
    transition_time: 300, // 5 minutes
    blending_ratio: emotions.map(() => 1 / emotions.length),
    therapeutic_focus: [config.therapeuticGoal || 'equilibrium'],
  };

  return {
    name: `Transition vers ${config.targetEmotion}`,
    description: `Mélange progressif depuis ${config.currentEmotions.join(', ')} vers ${config.targetEmotion}`,
    emotions,
    strategy,
    expected_duration: 600, // 10 minutes
    difficulty_level: Math.round((config.intensity || 0.5) * 10),
  };
}

/**
 * Obtenir la couleur d'une émotion
 */
function getEmotionColor(emotion: string): string {
  return EMOTION_COLORS[emotion.toLowerCase()] || '#808080';
}

/**
 * Obtenir la fréquence d'une émotion
 */
function getEmotionFrequency(emotion: string): number {
  return EMOTION_FREQUENCIES[emotion.toLowerCase()] || 440;
}

/**
 * Interface pour le profil émotionnel
 */
interface EmotionalProfile {
  dominant_emotions: string[];
  emotional_range: number;
  stability: number;
}

/**
 * Récupérer le profil émotionnel de l'utilisateur
 */
async function getUserEmotionalProfile(userId: string): Promise<EmotionalProfile> {
  try {
    // Récupérer les entrées de journal récentes pour analyser les émotions
    const { data: journalEntries, error: journalError } = await supabase
      .from('journal_entries')
      .select('mood_score, emotions')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (journalError) {
      logger.error('Failed to fetch journal entries:', journalError, 'MODULE');
      return getDefaultProfile();
    }

    // Récupérer les sessions de méditation pour la stabilité
    const { data: meditationSessions, error: meditationError } = await supabase
      .from('meditation_sessions')
      .select('mood_before, mood_after')
      .eq('user_id', userId)
      .not('mood_before', 'is', null)
      .not('mood_after', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (meditationError) {
      logger.error('Failed to fetch meditation sessions:', meditationError, 'MODULE');
    }

    // Analyser les émotions dominantes
    const emotionCounts: Record<string, number> = {};
    const moodScores: number[] = [];

    journalEntries?.forEach((entry) => {
      if (entry.mood_score !== null && entry.mood_score !== undefined) {
        moodScores.push(entry.mood_score);
      }
      if (entry.emotions && Array.isArray(entry.emotions)) {
        entry.emotions.forEach((emotion: string) => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      }
    });

    // Calculer les émotions dominantes
    const dominantEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion]) => emotion);

    // Calculer la plage émotionnelle (variation des humeurs)
    const emotionalRange =
      moodScores.length > 1
        ? (Math.max(...moodScores) - Math.min(...moodScores)) / 100
        : 0.5;

    // Calculer la stabilité (constance des améliorations en méditation)
    let stability = 0.5;
    if (meditationSessions && meditationSessions.length > 0) {
      const improvements = meditationSessions
        .map((s) => (s.mood_after || 0) - (s.mood_before || 0))
        .filter((imp) => !isNaN(imp));

      if (improvements.length > 0) {
        const avgImprovement = improvements.reduce((a, b) => a + b, 0) / improvements.length;
        stability = Math.min(Math.max(avgImprovement / 50, 0), 1);
      }
    }

    return {
      dominant_emotions:
        dominantEmotions.length > 0 ? dominantEmotions : ['calm', 'neutral'],
      emotional_range: Math.min(Math.max(emotionalRange, 0), 1),
      stability: Math.min(Math.max(stability, 0), 1),
    };
  } catch (error) {
    logger.error('Error fetching emotional profile:', error, 'MODULE');
    return getDefaultProfile();
  }
}

/**
 * Retourner un profil émotionnel par défaut
 */
function getDefaultProfile(): EmotionalProfile {
  return {
    dominant_emotions: ['calm', 'neutral'],
    emotional_range: 0.5,
    stability: 0.5,
  };
}

/**
 * Récupérer l'historique des mélanges
 */
async function fetchBlendingHistory(userId: string, limit: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('mood_mixer_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

/**
 * Calculer le blend émotionnel à un instant donné
 */
export function calculateBlendAtTime(
  emotions: EmotionComponent[],
  strategy: MixingStrategy,
  elapsedSeconds: number
): EmotionBlend {
  const progress = Math.min(1, elapsedSeconds / strategy.transition_time);

  // Calculer les intensités actuelles selon l'algorithme
  const currentIntensities = calculateIntensities(emotions, strategy, progress);

  // Trouver l'émotion dominante
  let maxIntensity = 0;
  let dominantIndex = 0;
  currentIntensities.forEach((intensity, index) => {
    if (intensity > maxIntensity) {
      maxIntensity = intensity;
      dominantIndex = index;
    }
  });

  const dominant = emotions[dominantIndex].emotion;

  // Émotions secondaires (intensité > 0.3)
  const secondary: string[] = [];
  currentIntensities.forEach((intensity, index) => {
    if (index !== dominantIndex && intensity > 0.3) {
      secondary.push(emotions[index].emotion);
    }
  });

  // Calculer stabilité (variance des intensités)
  const mean = currentIntensities.reduce((a, b) => a + b, 0) / currentIntensities.length;
  const variance =
    currentIntensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    currentIntensities.length;
  const stability = 1 - Math.min(1, variance);

  // Outcome thérapeutique basé sur la progression
  const therapeuticOutcome = progress * maxIntensity;

  return {
    dominant_emotion: dominant,
    secondary_emotions: secondary,
    intensity_level: maxIntensity,
    stability_score: stability,
    therapeutic_outcome: therapeuticOutcome,
  };
}

/**
 * Calculer les intensités selon l'algorithme
 */
function calculateIntensities(
  emotions: EmotionComponent[],
  strategy: MixingStrategy,
  progress: number
): number[] {
  switch (strategy.algorithm) {
    case 'gradual':
      return calculateGradualIntensities(emotions, progress);
    case 'instant':
      return calculateInstantIntensities(emotions, progress);
    case 'oscillating':
      return calculateOscillatingIntensities(emotions, progress);
    case 'layered':
      return calculateLayeredIntensities(emotions, progress);
    default:
      return emotions.map((e) => e.intensity);
  }
}

/**
 * Algorithme graduel : transition linéaire
 */
function calculateGradualIntensities(
  emotions: EmotionComponent[],
  progress: number
): number[] {
  if (emotions.length < 2) return emotions.map((e) => e.intensity);

  // Les émotions initiales diminuent, la cible augmente
  return emotions.map((emotion, index) => {
    if (index < emotions.length - 1) {
      // Émotions actuelles : diminuent avec le temps
      return emotion.intensity * (1 - progress);
    } else {
      // Émotion cible : augmente avec le temps
      return progress;
    }
  });
}

/**
 * Algorithme instant : changement brusque à mi-parcours
 */
function calculateInstantIntensities(
  emotions: EmotionComponent[],
  progress: number
): number[] {
  const threshold = 0.5;
  return emotions.map((emotion, index) => {
    if (index < emotions.length - 1) {
      return progress < threshold ? emotion.intensity : 0;
    } else {
      return progress >= threshold ? 1 : 0;
    }
  });
}

/**
 * Algorithme oscillant : va-et-vient entre émotions
 */
function calculateOscillatingIntensities(
  emotions: EmotionComponent[],
  progress: number
): number[] {
  const frequency = 2; // Oscillations
  const wave = (Math.sin(progress * Math.PI * frequency) + 1) / 2;

  return emotions.map((emotion, index) => {
    if (index < emotions.length - 1) {
      return emotion.intensity * (1 - wave);
    } else {
      return wave;
    }
  });
}

/**
 * Algorithme layered : superposition progressive
 */
function calculateLayeredIntensities(
  emotions: EmotionComponent[],
  progress: number
): number[] {
  return emotions.map((emotion, index) => {
    const layerStart = index / emotions.length;
    const layerProgress = Math.max(0, Math.min(1, (progress - layerStart) * emotions.length));
    return emotion.intensity * (0.3 + 0.7 * layerProgress);
  });
}

/**
 * Convertir sliders émotionnels en composants
 */
export function slidersToEmotionComponents(sliders: EmotionalSliders): EmotionComponent[] {
  const components: EmotionComponent[] = [];

  if (sliders.energy > 20) {
    components.push({
      emotion: 'energetic',
      intensity: sliders.energy / 100,
      color: '#FF4500',
      audio_frequency: 600,
      therapeutic_value: 0.7,
    });
  }

  if (sliders.calm > 20) {
    components.push({
      emotion: 'calm',
      intensity: sliders.calm / 100,
      color: '#87CEEB',
      audio_frequency: 396,
      therapeutic_value: 0.8,
    });
  }

  if (sliders.focus > 20) {
    components.push({
      emotion: 'focused',
      intensity: sliders.focus / 100,
      color: '#4169E1',
      audio_frequency: 741,
      therapeutic_value: 0.75,
    });
  }

  if (sliders.light > 20) {
    components.push({
      emotion: 'light',
      intensity: sliders.light / 100,
      color: '#FFD700',
      audio_frequency: 528,
      therapeutic_value: 0.7,
    });
  }

  return components;
}

/**
 * Générer un gradient CSS depuis les composants émotionnels
 */
export function generateEmotionalGradient(emotions: EmotionComponent[]): string {
  if (emotions.length === 0) {
    return 'linear-gradient(135deg, #87CEEB 0%, #FFD700 100%)';
  }

  const colors = emotions.map((e) => e.color);
  const step = 100 / colors.length;

  const gradientStops = colors.map((color, index) => `${color} ${index * step}%`).join(', ');

  return `linear-gradient(135deg, ${gradientStops})`;
}
