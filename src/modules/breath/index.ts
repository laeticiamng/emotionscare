/**
 * Module Breath - Utilitaires de respiration
 * Module utilitaire fournissant des protocoles, logging et mood tracking
 *
 * NOTE: Ce module fournit des utilitaires partagés.
 * Pour les composants UI de respiration, voir:
 * - /src/modules/breathing-vr
 * - /src/modules/breath-constellation
 *
 * @module breath
 */

// ============================================================================
// PROTOCOLS
// ============================================================================

export {
  breathProtocols,
  type BreathProtocol,
  type BreathPhase,
} from './protocols';

// ============================================================================
// MOOD TRACKING
// ============================================================================

export {
  getBreathingMoodSuggestion,
  type BreathingMoodSuggestion,
} from './mood';

// ============================================================================
// LOGGING
// ============================================================================

export {
  logBreathingSession,
  type BreathingSessionLog,
} from './logging';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useSessionClock,
  type SessionClockState,
} from './useSessionClock';
