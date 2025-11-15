/**
 * Module Mood Mixer - Mixeur d'humeur
 * Système de mélange d'émotions pour créer des playlists personnalisées
 *
 * @module mood-mixer
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export {
  MoodMixerView,
  default as MoodMixerViewDefault,
} from './MoodMixerView';

// ============================================================================
// SERVICES
// ============================================================================

export {
  moodMixerService,
  default as moodMixerServiceDefault,
} from './moodMixerService';

// Export du service enrichi (version avancée)
export {
  moodMixerServiceEnriched,
} from './moodMixerServiceEnriched';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useMoodMixer,
} from './useMoodMixer';

// ============================================================================
// TYPES
// ============================================================================

export type {
  Mood,
  MoodMix,
  EmotionWeight,
  MixedPlaylist,
  MoodTransition,
} from './types';

// ============================================================================
// UTILITIES
// ============================================================================

export {
  blendMoods,
  calculateMoodIntensity,
  generateMoodGradient,
} from './utils';
