/**
 * Feature: Mood Management
 * Point d'entrée unifié pour toute la gestion de l'humeur
 * 
 * MIGRATION: Utiliser useMoodUnified pour les nouveaux développements
 * Les anciens hooks sont conservés pour compatibilité ascendante
 */

// ============================================================================
// HOOK UNIFIÉ (RECOMMANDÉ)
// ============================================================================

export { 
  useMoodUnified, 
  useUnifiedMoodStore,
  type MoodState,
  type MoodEntry,
  type SessionState,
  type MoodStats,
} from '@/hooks/unified/useMoodUnified';

// ============================================================================
// EVENT BUS
// ============================================================================

export { 
  MOOD_UPDATED, 
  publishMoodUpdated, 
  type MoodEventDetail, 
  type MoodQuadrant 
} from './mood-bus';

// ============================================================================
// HOOKS SPÉCIALISÉS
// ============================================================================

export { useMoodPublisher } from './useMoodPublisher';
export { useSamOrchestration } from './useSamOrchestration';

// ============================================================================
// LEGACY HOOKS (pour compatibilité - préférer useMoodUnified)
// ============================================================================

/** @deprecated Utiliser useMoodUnified à la place */
export { useMood } from '@/hooks/useMood';

/** @deprecated Utiliser useMoodUnified à la place */
export { useMoodSession } from '@/hooks/useMoodSession';

/** @deprecated Utiliser useMoodUnified().snapshot à la place */
export { useCurrentMood } from '@/hooks/useCurrentMood';

/** @deprecated Utiliser useMoodUnified().recordMood à la place */
export { useMoodTracking } from '@/hooks/useMoodTracking';
