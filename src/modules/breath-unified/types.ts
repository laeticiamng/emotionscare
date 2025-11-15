/**
 * Module Breath Unified - Types
 * Types unifiés pour toutes les fonctionnalités de respiration
 * Consolide breath, bubble-beat, breath-constellation, et breathing-vr
 *
 * @module breath-unified/types
 */

import { z } from 'zod';

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Type de session de respiration
 */
export const BreathSessionType = z.enum([
  'basic',        // Protocole respiratoire classique (4-7-8, cohérence)
  'gamified',     // Jeu ludique (bubble-beat)
  'visual',       // Visualisation artistique (constellation)
  'immersive',    // Expérience VR/AR
]);

export type BreathSessionType = z.infer<typeof BreathSessionType>;

/**
 * Phase de respiration
 */
export const BreathPhase = z.enum(['in', 'hold', 'out', 'pause']);

export type BreathPhase = z.infer<typeof BreathPhase>;

// ============================================================================
// BREATH PROTOCOLS (from breath module)
// ============================================================================

/**
 * Protocoles de respiration disponibles
 */
export const BreathProtocol = z.enum(['478', 'coherence', 'box', 'relax']);

export type BreathProtocol = z.infer<typeof BreathProtocol>;

/**
 * Étape de protocole de respiration
 */
export const BreathStep = z.object({
  kind: BreathPhase,
  duration_ms: z.number().int().min(0),
});

export type BreathStep = z.infer<typeof BreathStep>;

/**
 * Configuration de protocole
 */
export const ProtocolConfig = z.object({
  protocol: BreathProtocol,
  duration_minutes: z.number().min(0.5).max(60).default(5),

  // Overrides optionnels
  inhale_ms: z.number().int().min(1000).optional(),
  hold_ms: z.number().int().min(0).optional(),
  exhale_ms: z.number().int().min(1000).optional(),
  pause_ms: z.number().int().min(0).optional(),
});

export type ProtocolConfig = z.infer<typeof ProtocolConfig>;

// ============================================================================
// GAMIFIED (from bubble-beat)
// ============================================================================

/**
 * Difficulté du jeu
 */
export const GameDifficulty = z.enum(['easy', 'medium', 'hard', 'expert']);

export type GameDifficulty = z.infer<typeof GameDifficulty>;

/**
 * Mood du jeu
 */
export const GameMood = z.enum(['calm', 'energetic', 'focus', 'relax']);

export type GameMood = z.infer<typeof GameMood>;

/**
 * Statistiques de jeu
 */
export const GameStats = z.object({
  score: z.number().int().min(0),
  items_completed: z.number().int().min(0),  // bubbles_popped, stars, etc.
  accuracy: z.number().min(0).max(1),
  combo_max: z.number().int().min(0),
});

export type GameStats = z.infer<typeof GameStats>;

// ============================================================================
// VISUAL (from breath-constellation)
// ============================================================================

/**
 * Style de visualisation
 */
export const VisualStyle = z.enum([
  'constellation',  // Points connectés
  'waves',          // Vagues fluides
  'particles',      // Particules
  'mandala',        // Mandalas
  'aurora',         // Aurores boréales
]);

export type VisualStyle = z.infer<typeof VisualStyle>;

/**
 * Configuration visuelle
 */
export const VisualConfig = z.object({
  style: VisualStyle,
  color_scheme: z.enum(['warm', 'cool', 'rainbow', 'monochrome']).default('cool'),
  intensity: z.number().min(0).max(1).default(0.7),
  complexity: z.number().min(0).max(1).default(0.5),
  animation_speed: z.number().min(0.1).max(2).default(1),
});

export type VisualConfig = z.infer<typeof VisualConfig>;

// ============================================================================
// IMMERSIVE (from breathing-vr)
// ============================================================================

/**
 * Type d'environnement immersif
 */
export const ImmersiveEnvironment = z.enum([
  'forest',
  'beach',
  'mountain',
  'space',
  'underwater',
  'zen_garden',
]);

export type ImmersiveEnvironment = z.infer<typeof ImmersiveEnvironment>;

/**
 * Configuration immersive
 */
export const ImmersiveConfig = z.object({
  environment: ImmersiveEnvironment,
  vr_enabled: z.boolean().default(false),
  audio_ambient: z.boolean().default(true),
  haptic_feedback: z.boolean().default(false),
  biofeedback_enabled: z.boolean().default(false),
});

export type ImmersiveConfig = z.infer<typeof ImmersiveConfig>;

/**
 * Données biofeedback
 */
export const BiofeedbackData = z.object({
  heart_rate: z.number().min(30).max(220).optional(),
  hrv: z.number().min(0).max(200).optional(),  // Heart Rate Variability (ms)
  respiration_rate: z.number().min(5).max(40).optional(),  // breaths/min
  oxygen_saturation: z.number().min(0).max(100).optional(),  // SpO2 %
  timestamp: z.string().datetime(),
});

export type BiofeedbackData = z.infer<typeof BiofeedbackData>;

// ============================================================================
// UNIFIED SESSION
// ============================================================================

/**
 * Session de respiration unifiée
 */
export const BreathSession = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),

  // Type et configuration
  session_type: BreathSessionType,

  // Pour basic
  protocol_config: ProtocolConfig.optional(),

  // Pour gamified
  game_difficulty: GameDifficulty.optional(),
  game_mood: GameMood.optional(),
  game_stats: GameStats.optional(),

  // Pour visual
  visual_config: VisualConfig.optional(),

  // Pour immersive
  immersive_config: ImmersiveConfig.optional(),
  biofeedback_data: z.array(BiofeedbackData).optional(),

  // Métriques communes
  duration_seconds: z.number().int().min(0),
  breaths_completed: z.number().int().min(0),

  // État pré/post
  stress_level_before: z.number().min(0).max(10).optional(),
  stress_level_after: z.number().min(0).max(10).optional(),
  mood_before: z.string().optional(),
  mood_after: z.string().optional(),

  // Efficacité
  completion_rate: z.number().min(0).max(1),  // % du protocole complété
  consistency_score: z.number().min(0).max(1).optional(),  // Régularité
  therapeutic_effectiveness: z.number().min(0).max(1).optional(),

  // Timestamps
  created_at: z.string().datetime(),
  started_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),

  // Métadonnées
  metadata: z.record(z.unknown()).optional(),
});

export type BreathSession = z.infer<typeof BreathSession>;

// ============================================================================
// BREATH CYCLE TRACKING
// ============================================================================

/**
 * Cycle de respiration enregistré
 */
export const BreathCycle = z.object({
  cycle_number: z.number().int().min(1),
  inhale_duration_ms: z.number().int().min(0),
  hold_duration_ms: z.number().int().min(0),
  exhale_duration_ms: z.number().int().min(0),
  pause_duration_ms: z.number().int().min(0),
  total_duration_ms: z.number().int().min(0),
  quality_score: z.number().min(0).max(1),  // 0-1 based on adherence to protocol
  timestamp: z.string().datetime(),
});

export type BreathCycle = z.infer<typeof BreathCycle>;

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Statistiques de session
 */
export const SessionStatistics = z.object({
  user_id: z.string().uuid(),

  // Totaux
  total_sessions: z.number().int().min(0),
  total_duration_seconds: z.number().int().min(0),
  total_breaths: z.number().int().min(0),

  // Par type
  sessions_by_type: z.record(z.number().int()),

  // Efficacité
  average_completion_rate: z.number().min(0).max(1),
  average_consistency: z.number().min(0).max(1),
  average_stress_reduction: z.number().min(-10).max(10),  // Différence avant/après

  // Gamified stats
  total_game_score: z.number().int().min(0).optional(),
  best_game_score: z.number().int().min(0).optional(),
  total_items_completed: z.number().int().min(0).optional(),

  // Protocoles préférés
  favorite_protocols: z.array(BreathProtocol).optional(),
  most_effective_protocol: BreathProtocol.optional(),

  // Période
  period_start: z.string().datetime(),
  period_end: z.string().datetime(),
});

export type SessionStatistics = z.infer<typeof SessionStatistics>;

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

/**
 * Recommandation de protocole
 */
export const ProtocolRecommendation = z.object({
  protocol: BreathProtocol,
  session_type: BreathSessionType,
  duration_minutes: z.number().min(1).max(30),

  // Configuration spécifique
  protocol_config: ProtocolConfig.optional(),
  visual_config: VisualConfig.optional(),
  game_config: z.object({
    difficulty: GameDifficulty,
    mood: GameMood,
  }).optional(),

  // Justification
  reasoning: z.string(),
  expected_benefits: z.array(z.string()),
  optimal_timing: z.string(),
  confidence_score: z.number().min(0).max(1),
});

export type ProtocolRecommendation = z.infer<typeof ProtocolRecommendation>;

// ============================================================================
// ACHIEVEMENTS & CHALLENGES
// ============================================================================

/**
 * Achievement débloqué
 */
export const Achievement = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['consistency', 'duration', 'mastery', 'exploration', 'social']),
  icon: z.string(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
  points: z.number().int().min(0),
  unlocked_at: z.string().datetime().optional(),
});

export type Achievement = z.infer<typeof Achievement>;

/**
 * Challenge actif
 */
export const Challenge = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  goal_type: z.enum(['sessions', 'duration', 'streaks', 'score']),
  goal_value: z.number().min(1),
  current_progress: z.number().min(0),
  reward_points: z.number().int().min(0),
  expires_at: z.string().datetime().optional(),
});

export type Challenge = z.infer<typeof Challenge>;
