/**
 * Module Breath Unified - Point d'entrée
 * Service unifié pour toutes les fonctionnalités de respiration
 * Consolide breath, bubble-beat, breath-constellation, et breathing-vr
 *
 * @module breath-unified
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  BreathUnifiedService,
  breathUnifiedService,
  default as breathUnifiedServiceDefault,
} from './breathUnifiedService';

// ============================================================================
// HOOKS
// ============================================================================

export { useBreathUnified } from './useBreathUnified';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Core
  BreathSessionType,
  BreathPhase,

  // Protocols
  BreathProtocol,
  BreathStep,
  ProtocolConfig,

  // Gamified
  GameDifficulty,
  GameMood,
  GameStats,

  // Visual
  VisualStyle,
  VisualConfig,

  // Immersive
  ImmersiveEnvironment,
  ImmersiveConfig,
  BiofeedbackData,

  // Session
  BreathSession,
  BreathCycle,

  // Analytics
  SessionStatistics,
  ProtocolRecommendation,

  // Gamification
  Achievement,
  Challenge,
} from './types';

// ============================================================================
// SCHEMAS (pour validation Zod)
// ============================================================================

export {
  BreathSessionType as BreathSessionTypeSchema,
  BreathPhase as BreathPhaseSchema,
  BreathProtocol as BreathProtocolSchema,
  BreathStep as BreathStepSchema,
  ProtocolConfig as ProtocolConfigSchema,
  GameDifficulty as GameDifficultySchema,
  GameMood as GameMoodSchema,
  GameStats as GameStatsSchema,
  VisualStyle as VisualStyleSchema,
  VisualConfig as VisualConfigSchema,
  ImmersiveEnvironment as ImmersiveEnvironmentSchema,
  ImmersiveConfig as ImmersiveConfigSchema,
  BiofeedbackData as BiofeedbackDataSchema,
  BreathSession as BreathSessionSchema,
  BreathCycle as BreathCycleSchema,
  SessionStatistics as SessionStatisticsSchema,
  ProtocolRecommendation as ProtocolRecommendationSchema,
  Achievement as AchievementSchema,
  Challenge as ChallengeSchema,
} from './types';

// Export default
export { breathUnifiedService as default } from './breathUnifiedService';
