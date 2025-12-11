/**
 * Module Mood Mixer - Mixeur d'humeur
 * Système de mélange d'émotions pour créer des playlists personnalisées
 *
 * @module mood-mixer
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { MoodMixerView } from './MoodMixerView';

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export { MoodMixerService, moodMixerService } from './moodMixerServiceUnified';

// ============================================================================
// HOOKS
// ============================================================================

export { useMoodMixer } from './useMoodMixer';

// ============================================================================
// TYPES
// ============================================================================

export type {
  MoodMixerSession,
  EmotionComponent,
  MixingStrategy,
  BlendingStep,
  EmotionBlend,
  PersonalizedMix,
  MoodMixerStats,
} from './moodMixerServiceUnified';

// ============================================================================
// LEGACY EXPORTS (deprecated - utiliser MoodMixerService à la place)
// ============================================================================

/** @deprecated Utiliser MoodMixerService à la place */
export { MoodMixerService as MoodMixerServiceEnriched } from './moodMixerServiceUnified';
