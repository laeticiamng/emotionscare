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
export * from './components';

// ============================================================================
// HOOKS
// ============================================================================

export { useMoodMixer } from './useMoodMixer';
export { useMoodMixerEnriched } from './useMoodMixerEnriched';
export type { MoodComponent, MoodPreset, UseMoodMixerEnrichedReturn } from './useMoodMixerEnriched';
export * from './hooks';

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export { MoodMixerService, moodMixerService } from './moodMixerServiceUnified';

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

export type {
  Sliders,
  PresetDraft,
  PresetInsert,
  PresetRecord,
  PresetUpdate,
  Preset,
} from './types';

// ============================================================================
// LEGACY EXPORTS (deprecated - utiliser MoodMixerService à la place)
// ============================================================================

/** @deprecated Utiliser MoodMixerService à la place */
export { MoodMixerService as MoodMixerServiceEnriched } from './moodMixerServiceUnified';
