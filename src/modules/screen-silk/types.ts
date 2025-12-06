/**
 * Screen Silk Module - Types & Schemas
 * Module de micro-pauses écran et repos visuel
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums & Constants
// ─────────────────────────────────────────────────────────────

export const BREAK_DURATIONS = [60, 120, 180, 300] as const; // en secondes
export const BREAK_LABELS = ['gain', 'léger', 'incertain'] as const;
export const SESSION_PHASES = ['idle', 'loading', 'preparation', 'active', 'ending', 'completed', 'error'] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const BreakLabelSchema = z.enum(BREAK_LABELS);
export const SessionPhaseSchema = z.enum(SESSION_PHASES);

export const ScreenSilkSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  duration_seconds: z.number().int().min(60).max(600),
  blink_count: z.number().int().min(0),
  completion_label: BreakLabelSchema.nullable(),
  interrupted: z.boolean(),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const CreateScreenSilkSessionSchema = z.object({
  duration_seconds: z.number().int().min(60).max(600),
});

export const CompleteScreenSilkSessionSchema = z.object({
  session_id: z.string().uuid(),
  blink_count: z.number().int().min(0),
  completion_label: BreakLabelSchema,
});

export const InterruptScreenSilkSessionSchema = z.object({
  session_id: z.string().uuid(),
  blink_count: z.number().int().min(0),
});

export const ScreenSilkStatsSchema = z.object({
  total_sessions: z.number().int().min(0),
  total_completed: z.number().int().min(0),
  total_interrupted: z.number().int().min(0),
  total_break_time_minutes: z.number().min(0),
  average_duration_minutes: z.number().min(0),
  completion_rate: z.number().min(0).max(100),
});

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────

export type BreakLabel = z.infer<typeof BreakLabelSchema>;
export type SessionPhase = z.infer<typeof SessionPhaseSchema>;
export type ScreenSilkSession = z.infer<typeof ScreenSilkSessionSchema>;
export type CreateScreenSilkSession = z.infer<typeof CreateScreenSilkSessionSchema>;
export type CompleteScreenSilkSession = z.infer<typeof CompleteScreenSilkSessionSchema>;
export type InterruptScreenSilkSession = z.infer<typeof InterruptScreenSilkSessionSchema>;
export type ScreenSilkStats = z.infer<typeof ScreenSilkStatsSchema>;

// ─────────────────────────────────────────────────────────────
// State Machine Types
// ─────────────────────────────────────────────────────────────

export interface ScreenSilkState {
  phase: SessionPhase;
  session: ScreenSilkSession | null;
  timeRemaining: number;
  blinkCount: number;
  error: string | null;
}

export interface ScreenSilkConfig {
  duration: number; // en secondes
  enableBlinkGuide: boolean;
  blinkInterval: number; // en secondes
  onComplete?: (label: BreakLabel) => void;
  onInterrupt?: () => void;
}
