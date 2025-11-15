/**
 * Module Music Unified - Types
 * Types unifiés pour toutes les fonctionnalités musicales
 * Consolide music-therapy, mood-mixer, et adaptive-music
 *
 * @module music-unified/types
 */

import { z } from 'zod';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Type de session musicale
 */
export const MusicSessionType = z.enum([
  'therapeutic',    // Musicothérapie guidée
  'mood_blending',  // Mélange d'humeurs
  'adaptive',       // Adaptation temps réel
  'freestyle',      // Écoute libre
]);

export type MusicSessionType = z.infer<typeof MusicSessionType>;

/**
 * État émotionnel musical
 */
export const MusicalMood = z.object({
  primary: z.string(),              // Humeur primaire
  secondary: z.array(z.string()).optional(),  // Humeurs secondaires
  intensity: z.number().min(0).max(1),        // Intensité (0-1)
  energy: z.number().min(0).max(1),           // Énergie (0-1)
  valence: z.number().min(-1).max(1),         // Valence émotionnelle (-1=négatif, +1=positif)
});

export type MusicalMood = z.infer<typeof MusicalMood>;

// ============================================================================
// TRACKS & PLAYLISTS
// ============================================================================

/**
 * Propriétés thérapeutiques d'une piste
 */
export const TherapeuticProperties = z.object({
  mood_target: z.string(),                    // Humeur ciblée
  energy_level: z.number().min(0).max(1),    // Niveau d'énergie
  stress_reduction: z.number().min(0).max(1), // Réduction du stress
  emotional_resonance: z.number().min(0).max(1), // Résonance émotionnelle
  tempo_bpm: z.number().int().min(40).max(200).optional(), // Tempo (BPM)
  key: z.string().optional(),                 // Tonalité musicale
  mode: z.enum(['major', 'minor']).optional(), // Mode (majeur/mineur)
});

export type TherapeuticProperties = z.infer<typeof TherapeuticProperties>;

/**
 * Piste musicale unifiée
 */
export const MusicTrack = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  duration_seconds: z.number().int().min(0),
  url: z.string().url().optional(),

  // Propriétés thérapeutiques
  therapeutic_properties: TherapeuticProperties,

  // Métadonnées additionnelles
  genre: z.string().optional(),
  release_year: z.number().int().optional(),
  album: z.string().optional(),

  // Métadonnées IA
  ai_generated: z.boolean().optional(),
  ai_metadata: z.record(z.unknown()).optional(),
});

export type MusicTrack = z.infer<typeof MusicTrack>;

/**
 * Playlist thérapeutique
 */
export const TherapeuticPlaylist = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  tracks: z.array(MusicTrack),

  // Objectif thérapeutique
  therapeutic_goal: z.string(),
  expected_mood_shift: z.number().min(-1).max(1), // Changement d'humeur attendu

  // Personnalisation
  personalization_score: z.number().min(0).max(1),
  user_preferences_applied: z.array(z.string()).optional(),

  // Métadonnées
  created_at: z.string().datetime(),
  duration_total_seconds: z.number().int().min(0),
  difficulty_level: z.number().int().min(1).max(10).optional(),
});

export type TherapeuticPlaylist = z.infer<typeof TherapeuticPlaylist>;

// ============================================================================
// MOOD BLENDING (from mood-mixer)
// ============================================================================

/**
 * Sliders émotionnels (de mood-mixer)
 */
export const EmotionalSliders = z.object({
  energy: z.number().min(0).max(100),
  calm: z.number().min(0).max(100),
  focus: z.number().min(0).max(100),
  light: z.number().min(0).max(100),
});

export type EmotionalSliders = z.infer<typeof EmotionalSliders>;

/**
 * Composant émotionnel pour le mélange
 */
export const EmotionComponent = z.object({
  emotion: z.string(),
  intensity: z.number().min(0).max(1),
  color: z.string(),
  audio_frequency: z.number().min(20).max(20000).optional(), // Hz
  therapeutic_value: z.number().min(0).max(1),
});

export type EmotionComponent = z.infer<typeof EmotionComponent>;

/**
 * Stratégie de mélange
 */
export const MixingStrategy = z.object({
  algorithm: z.enum(['gradual', 'instant', 'oscillating', 'layered']),
  transition_time: z.number().int().min(0), // secondes
  blending_ratio: z.array(z.number().min(0).max(1)),
  therapeutic_focus: z.array(z.string()),
});

export type MixingStrategy = z.infer<typeof MixingStrategy>;

/**
 * Étape de mélange
 */
export const BlendingStep = z.object({
  timestamp: z.number().int().min(0),
  emotions_active: z.array(EmotionComponent),
  blend_percentage: z.number().min(0).max(100),
  user_feedback: z.number().min(0).max(10).optional(),
  physiological_response: z.record(z.unknown()).optional(),
});

export type BlendingStep = z.infer<typeof BlendingStep>;

/**
 * Résultat du mélange émotionnel
 */
export const EmotionBlend = z.object({
  dominant_emotion: z.string(),
  secondary_emotions: z.array(z.string()),
  intensity_level: z.number().min(0).max(1),
  stability_score: z.number().min(0).max(1),
  therapeutic_outcome: z.number().min(0).max(1),
});

export type EmotionBlend = z.infer<typeof EmotionBlend>;

// ============================================================================
// ADAPTIVE PLAYBACK (from adaptive-music)
// ============================================================================

/**
 * POMS (Profile of Mood States) - État physiologique
 */
export const PomsState = z.object({
  tension: z.enum(['relaxed', 'open', 'vigilant']),
  fatigue: z.enum(['resourced', 'stable', 'heavy']),
  timestamp: z.string().datetime(),
});

export type PomsState = z.infer<typeof PomsState>;

/**
 * Tendance POMS
 */
export const PomsTrend = z.object({
  tension_trend: z.enum(['up', 'down', 'steady']),
  fatigue_trend: z.enum(['up', 'down', 'steady']),
  note: z.string().nullable(),
  completed: z.boolean(),
});

export type PomsTrend = z.infer<typeof PomsTrend>;

/**
 * Adaptation de lecture
 */
export const PlaybackAdaptation = z.object({
  timestamp: z.string().datetime(),
  reason: z.string(),
  from_preset: z.string(),
  to_preset: z.string(),
  poms_state: PomsState,
  confidence: z.number().min(0).max(1),
});

export type PlaybackAdaptation = z.infer<typeof PlaybackAdaptation>;

// ============================================================================
// SESSIONS UNIFIÉES
// ============================================================================

/**
 * Point émotionnel dans le temps
 */
export const EmotionalPoint = z.object({
  timestamp: z.number().int().min(0), // secondes depuis début session
  mood: z.number().min(0).max(10),    // Humeur (0-10)
  energy: z.number().min(0).max(10),  // Énergie (0-10)
  track_id: z.string(),
  user_interaction: z.string().optional(), // skip, like, replay, etc.
  poms_state: PomsState.optional(),
});

export type EmotionalPoint = z.infer<typeof EmotionalPoint>;

/**
 * Session musicale unifiée
 */
export const MusicSession = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),

  // Type et configuration
  session_type: MusicSessionType,
  playlist_id: z.string().uuid().optional(),

  // État émotionnel
  mood_before: MusicalMood.optional(),
  mood_after: MusicalMood.optional(),

  // Pour mood blending
  initial_emotions: z.array(EmotionComponent).optional(),
  target_emotion: z.string().optional(),
  mixing_strategy: MixingStrategy.optional(),
  blending_steps: z.array(BlendingStep).optional(),
  final_blend: EmotionBlend.optional(),

  // Pour adaptive playback
  poms_before: PomsState.optional(),
  poms_after: PomsState.optional(),
  adaptations: z.array(PlaybackAdaptation).optional(),

  // Suivi de la session
  duration_seconds: z.number().int().min(0),
  tracks_played: z.array(z.string()),
  emotional_journey: z.array(EmotionalPoint).optional(),

  // Résultats
  therapeutic_effectiveness: z.number().min(0).max(1).optional(),
  user_satisfaction: z.number().min(0).max(10).optional(),
  mood_improvement: z.number().min(-10).max(10).optional(),

  // Timestamps
  created_at: z.string().datetime(),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type MusicSession = z.infer<typeof MusicSession>;

// ============================================================================
// RECOMMENDATIONS & GENERATION
// ============================================================================

/**
 * Configuration de génération de playlist
 */
export const PlaylistGenerationConfig = z.object({
  // Objectif thérapeutique
  therapeutic_goal: z.object({
    current_mood: MusicalMood,
    target_mood: MusicalMood,
    emotional_state: z.string(),
    intensity: z.number().min(0).max(1).optional(),
  }),

  // Préférences utilisateur
  preferences: z.object({
    genres: z.array(z.string()).optional(),
    artists: z.array(z.string()).optional(),
    excluded_artists: z.array(z.string()).optional(),
    tempo_range: z.object({
      min: z.number().int().min(40),
      max: z.number().int().max(200),
    }).optional(),
    duration_minutes: z.number().int().min(5).max(120).optional(),
  }).optional(),

  // Sliders émotionnels (mood-mixer style)
  emotional_sliders: EmotionalSliders.optional(),

  // POMS state (adaptive style)
  poms_state: PomsState.optional(),

  // Contexte
  context: z.object({
    time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
    activity: z.string().optional(), // meditation, work, exercise, sleep, etc.
    energy_level: z.number().min(0).max(1).optional(),
  }).optional(),
});

export type PlaylistGenerationConfig = z.infer<typeof PlaylistGenerationConfig>;

/**
 * Recommandation musicale
 */
export const MusicRecommendation = z.object({
  playlist: TherapeuticPlaylist,
  reasoning: z.string(),
  expected_benefits: z.array(z.string()),
  optimal_timing: z.string(),
  difficulty_level: z.number().int().min(1).max(10),
  confidence_score: z.number().min(0).max(1),
});

export type MusicRecommendation = z.infer<typeof MusicRecommendation>;

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Patterns d'écoute
 */
export const ListeningPatterns = z.object({
  favorite_genres: z.array(z.string()),
  favorite_artists: z.array(z.string()),
  preferred_tempo_range: z.object({
    min: z.number().int(),
    max: z.number().int(),
  }),
  preferred_energy_level: z.number().min(0).max(1),
  average_session_duration: z.number().int(), // secondes
  most_effective_times: z.array(z.string()),
  mood_improvement_average: z.number().min(-10).max(10),
});

export type ListeningPatterns = z.infer<typeof ListeningPatterns>;

/**
 * Statistiques de session
 */
export const SessionStatistics = z.object({
  total_sessions: z.number().int().min(0),
  total_duration_seconds: z.number().int().min(0),
  average_duration_seconds: z.number().min(0),

  // Par type de session
  sessions_by_type: z.record(z.number().int()),

  // Efficacité
  average_effectiveness: z.number().min(0).max(1),
  average_satisfaction: z.number().min(0).max(10),
  average_mood_improvement: z.number().min(-10).max(10),

  // Tendances
  most_used_moods: z.array(z.string()),
  most_effective_moods: z.array(z.string()),
  listening_patterns: ListeningPatterns,

  // Période
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
});

export type SessionStatistics = z.infer<typeof SessionStatistics>;

// ============================================================================
// PRESETS & FAVORITES
// ============================================================================

/**
 * Preset de configuration (de mood-mixer)
 */
export const MusicPreset = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(40),
  description: z.string().optional(),

  // Configuration
  sliders: EmotionalSliders,
  playlist_id: z.string().uuid().optional(),

  // Utilisation
  usage_count: z.number().int().min(0).default(0),
  last_used_at: z.string().datetime().optional(),

  // Métadonnées
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
});

export type MusicPreset = z.infer<typeof MusicPreset>;

/**
 * Favori utilisateur
 */
export const UserFavorite = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  item_type: z.enum(['track', 'playlist', 'preset']),
  item_id: z.string(),
  notes: z.string().optional(),
  created_at: z.string().datetime(),
});

export type UserFavorite = z.infer<typeof UserFavorite>;
