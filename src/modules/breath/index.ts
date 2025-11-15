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

// Note: These exports are commented out as the original exports don't exist in protocols.ts
// export {
//   breathProtocols,
//   type BreathProtocol,
//   type BreathPhase,
// } from './protocols';

export type { BreathStepKind, Step, ProtocolPreset, ProtocolOverrides, ProtocolConfig } from './protocols';
export { makeProtocol, getTotalDuration, getCycleDuration } from './protocols';

// ============================================================================
// MOOD TRACKING
// ============================================================================

// Note: These exports are commented out as the original exports don't exist in mood.ts
// export {
//   getBreathingMoodSuggestion,
//   type BreathingMoodSuggestion,
// } from './mood';

export { sanitizeMoodScore, computeMoodDelta } from './mood';

// ============================================================================
// LOGGING
// ============================================================================

// Note: These exports are commented out as the original exports don't exist in logging.ts
// export {
//   logBreathingSession,
//   type BreathingSessionLog,
// } from './logging';

export type { LogAndJournalPayload, LogAndJournalResult } from './logging';
export { logAndJournal } from './logging';

// ============================================================================
// HOOKS
// ============================================================================

export {
  useSessionClock,
  type SessionClockState,
} from './useSessionClock';
