/**
 * Module Sessions - Gestion de sessions
 * Hooks et utilitaires pour gérer les sessions utilisateur
 *
 * @module sessions
 */

// ============================================================================
// HOOKS
// ============================================================================

export {
  useSessionClock,
  default as useSessionClockDefault,
} from './hooks/useSessionClock';

// ============================================================================
// TYPES
// ============================================================================

// Re-export des types depuis les hooks
export type {
  SessionClockState,
  SessionClockActions,
  SessionConfig,
} from './hooks/useSessionClock';
