/**
 * Module Sessions - Gestion de sessions
 * Hooks, service et utilitaires pour gérer les sessions utilisateur
 *
 * @module sessions
 */

// ============================================================================
// SERVICE
// ============================================================================

export { SessionsService, sessionsService } from './sessionsService';

// ============================================================================
// HOOKS
// ============================================================================

export { useSessionClock } from './hooks/useSessionClock';
export { useSessions } from './useSessions';
export type { UseSessionsOptions, UseSessionsReturn } from './useSessions';

// ============================================================================
// TYPES
// ============================================================================

export type {
  SessionState,
  SessionType,
  SessionClockOptions,
  SessionClockState,
  TickCallback,
  Session,
  CreateSession,
  CompleteSession,
  SessionStats,
  DailySessionSummary,
  SessionReminder,
  CreateSessionReminder,
} from './types';

export {
  SessionStateSchema,
  SessionTypeSchema,
  SessionSchema,
  CreateSessionSchema,
  CompleteSessionSchema,
  SessionReminderSchema,
  CreateSessionReminderSchema,
} from './types';
