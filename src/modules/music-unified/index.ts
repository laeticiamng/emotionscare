/**
 * Module Music Unified - Point d'entrée
 * Service unifié pour toutes les fonctionnalités musicales
 * Consolide music-therapy, mood-mixer, et adaptive-music
 *
 * @module music-unified
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  MusicUnifiedService,
  musicUnifiedService,
  default as musicUnifiedServiceDefault,
} from './musicUnifiedService';

// ============================================================================
// HOOKS
// ============================================================================

export { useMusicUnified } from './useMusicUnified';

// ============================================================================
// CAPABILITIES
// ============================================================================

export * as TherapeuticCapability from './capabilities/therapeutic';
export * as BlendingCapability from './capabilities/blending';
export * as AdaptiveCapability from './capabilities/adaptive';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Core types
  MusicSessionType,
  MusicalMood,

  // Tracks & Playlists
  TherapeuticProperties,
  MusicTrack,
  TherapeuticPlaylist,

  // Mood Blending
  EmotionalSliders,
  EmotionComponent,
  MixingStrategy,
  BlendingStep,
  EmotionBlend,

  // Adaptive
  PomsState,
  PomsTrend,
  PlaybackAdaptation,

  // Sessions
  EmotionalPoint,
  MusicSession,

  // Recommendations & Generation
  PlaylistGenerationConfig,
  MusicRecommendation,

  // Statistics & Analytics
  ListeningPatterns,
  SessionStatistics,

  // Presets & Favorites
  MusicPreset,
  UserFavorite,
} from './types';

// ============================================================================
// SCHEMAS (pour validation Zod)
// ============================================================================

export {
  MusicSessionType as MusicSessionTypeSchema,
  MusicalMood as MusicalMoodSchema,
  TherapeuticProperties as TherapeuticPropertiesSchema,
  MusicTrack as MusicTrackSchema,
  TherapeuticPlaylist as TherapeuticPlaylistSchema,
  EmotionalSliders as EmotionalSlidersSchema,
  EmotionComponent as EmotionComponentSchema,
  MixingStrategy as MixingStrategySchema,
  BlendingStep as BlendingStepSchema,
  EmotionBlend as EmotionBlendSchema,
  PomsState as PomsStateSchema,
  PomsTrend as PomsTrendSchema,
  PlaybackAdaptation as PlaybackAdaptationSchema,
  EmotionalPoint as EmotionalPointSchema,
  MusicSession as MusicSessionSchema,
  PlaylistGenerationConfig as PlaylistGenerationConfigSchema,
  MusicRecommendation as MusicRecommendationSchema,
  ListeningPatterns as ListeningPatternsSchema,
  SessionStatistics as SessionStatisticsSchema,
  MusicPreset as MusicPresetSchema,
  UserFavorite as UserFavoriteSchema,
} from './types';

// Export default
export { musicUnifiedService as default } from './musicUnifiedService';
