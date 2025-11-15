/**
 * Module Music Therapy - Musicothérapie
 * Service de musicothérapie avec playlists basées sur l'humeur
 *
 * @module music-therapy
 */

// ============================================================================
// SERVICE
// ============================================================================

export {
  musicTherapyService,
  default as musicTherapyServiceDefault,
} from './musicTherapyService';

// Export du service enrichi (version avancée)
export {
  musicTherapyServiceEnriched,
} from './musicTherapyServiceEnriched';

// ============================================================================
// TYPES
// ============================================================================

// Export des types
export * from './types';

// Re-export des types depuis le service
export type {
  MoodType,
  TherapySession,
  MusicRecommendation,
  TherapyPlaylist,
} from './musicTherapyService';
