/**
 * Module Music Therapy - Musicothérapie
 * Service de musicothérapie avec playlists basées sur l'humeur
 *
 * @module music-therapy
 */

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export { MusicTherapyService, musicTherapyService } from './musicTherapyServiceUnified';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';
export type {
  MusicSession,
  EmotionalPoint,
  TherapeuticPlaylist,
  Track,
  MusicTherapyRecommendation,
  MusicTherapyStats,
} from './musicTherapyServiceUnified';

// ============================================================================
// LEGACY EXPORTS (deprecated - utiliser MusicTherapyService à la place)
// ============================================================================

/** @deprecated Utiliser MusicTherapyService à la place */
export { MusicTherapyService as MusicTherapyServiceEnriched } from './musicTherapyServiceUnified';
/** @deprecated Utiliser musicTherapyService à la place */
export { musicTherapyService as musicTherapyServiceEnriched } from './musicTherapyServiceUnified';
