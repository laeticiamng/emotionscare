/**
 * Bubble Beat Module - Types & Schemas
 * Module de libération musicale anti-stress par bulles
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums & Constants
// ─────────────────────────────────────────────────────────────

export const BUBBLE_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const BUBBLE_MOODS = ['calm', 'energetic', 'focus'] as const;
export const SESSION_PHASES = ['idle', 'playing', 'paused', 'completed'] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const BubbleDifficultySchema = z.enum(BUBBLE_DIFFICULTIES);
export const BubbleMoodSchema = z.enum(BUBBLE_MOODS);
export const SessionPhaseSchema = z.enum(SESSION_PHASES);

export const BubbleBeatSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  score: z.number().int().min(0),
  bubbles_popped: z.number().int().min(0),
  difficulty: BubbleDifficultySchema,
  mood: BubbleMoodSchema,
  duration_seconds: z.number().int().min(0),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const CreateBubbleBeatSessionSchema = z.object({
  difficulty: BubbleDifficultySchema,
  mood: BubbleMoodSchema,
});

export const CompleteBubbleBeatSessionSchema = z.object({
  session_id: z.string().uuid(),
  score: z.number().int().min(0),
  bubbles_popped: z.number().int().min(0),
  duration_seconds: z.number().int().min(0),
});

export const BubbleBeatStatsSchema = z.object({
  total_sessions: z.number().int().min(0),
  total_score: z.number().int().min(0),
  total_bubbles_popped: z.number().int().min(0),
  average_score: z.number().min(0),
  best_score: z.number().int().min(0),
  total_playtime_minutes: z.number().min(0),
});

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────

export type BubbleDifficulty = z.infer<typeof BubbleDifficultySchema>;
export type BubbleMood = z.infer<typeof BubbleMoodSchema>;
export type SessionPhase = z.infer<typeof SessionPhaseSchema>;
export type BubbleBeatSession = z.infer<typeof BubbleBeatSessionSchema>;
export type CreateBubbleBeatSession = z.infer<typeof CreateBubbleBeatSessionSchema>;
export type CompleteBubbleBeatSession = z.infer<typeof CompleteBubbleBeatSessionSchema>;
export type BubbleBeatStats = z.infer<typeof BubbleBeatStatsSchema>;

// ─────────────────────────────────────────────────────────────
// State Machine Types
// ─────────────────────────────────────────────────────────────

export interface BubbleBeatState {
  phase: SessionPhase;
  session: BubbleBeatSession | null;
  score: number;
  bubblesPopped: number;
  startTime: number | null;
  error: string | null;
}
