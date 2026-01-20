/**
 * Types pour le module Sessions
 * Gestion des sessions utilisateur et timers
 */

import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================

export const SessionStateSchema = z.enum(['idle', 'running', 'paused', 'completed']);
export type SessionState = z.infer<typeof SessionStateSchema>;

export const SessionTypeSchema = z.enum([
  'meditation',
  'breathing',
  'journal',
  'activity',
  'scan',
  'coaching',
  'story',
  'music',
  'game',
]);
export type SessionType = z.infer<typeof SessionTypeSchema>;

// ============================================================================
// SESSION CLOCK
// ============================================================================

export interface SessionClockOptions {
  /** Intervalle de tick en ms (min 16ms) */
  tickMs?: number;
  /** Durée totale en ms (optionnel pour timer infini) */
  durationMs?: number;
  /** Démarrer automatiquement */
  autoStart?: boolean;
}

export interface SessionClockState {
  state: SessionState;
  elapsedMs: number;
  progress?: number; // 0-1 si durationMs défini
}

export type TickCallback = (elapsedMs: number) => void;

// ============================================================================
// SESSION
// ============================================================================

export const SessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: SessionTypeSchema,
  module_id: z.string().optional(),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0).optional(),
  completed: z.boolean().default(false),
  mood_before: z.number().min(1).max(10).optional(),
  mood_after: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Session = z.infer<typeof SessionSchema>;

export const CreateSessionSchema = SessionSchema.pick({
  type: true,
  module_id: true,
  mood_before: true,
  metadata: true,
});

export type CreateSession = z.infer<typeof CreateSessionSchema>;

export const CompleteSessionSchema = z.object({
  ended_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0),
  completed: z.boolean().default(true),
  mood_after: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CompleteSession = z.infer<typeof CompleteSessionSchema>;

// ============================================================================
// SESSION STATS
// ============================================================================

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
  averageDuration: number;
  completionRate: number;
  streakDays: number;
  longestStreak: number;
  byType: Record<SessionType, number>;
  moodImprovement: number; // moyenne (mood_after - mood_before)
}

export interface DailySessionSummary {
  date: string;
  sessionsCount: number;
  totalMinutes: number;
  types: SessionType[];
  averageMood: number;
}

// ============================================================================
// SESSION REMINDER
// ============================================================================

export const SessionReminderSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: SessionTypeSchema,
  time: z.string(), // HH:mm format
  days: z.array(z.number().min(0).max(6)), // 0 = dimanche
  enabled: z.boolean().default(true),
  message: z.string().optional(),
  created_at: z.string().datetime(),
});

export type SessionReminder = z.infer<typeof SessionReminderSchema>;

export const CreateSessionReminderSchema = SessionReminderSchema.pick({
  type: true,
  time: true,
  days: true,
  message: true,
});

export type CreateSessionReminder = z.infer<typeof CreateSessionReminderSchema>;
