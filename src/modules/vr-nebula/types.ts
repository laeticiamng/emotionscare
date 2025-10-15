/**
 * VR Nebula Module Types
 * Expérience VR de respiration et cohérence cardiaque
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

export const NebulaSceneSchema = z.enum([
  'galaxy',
  'ocean',
  'forest',
  'space',
  'aurora',
  'cosmos',
]);
export type NebulaScene = z.infer<typeof NebulaSceneSchema>;

export const BreathingPatternSchema = z.enum([
  'box',      // 4-4-4-4
  'coherence', // 5-5-5-5 (cohérence cardiaque)
  'relax',    // 4-7-8
  'energize', // 3-0-5-0
  'calm',     // 6-0-6-0
]);
export type BreathingPattern = z.infer<typeof BreathingPatternSchema>;

export const NebulaPhaseSchema = z.enum([
  'idle',
  'loading',
  'calibrating',
  'active',
  'paused',
  'completing',
  'completed',
  'error',
]);
export type NebulaPhase = z.infer<typeof NebulaPhaseSchema>;

export const BreathPhaseSchema = z.enum([
  'inhale',
  'hold_in',
  'exhale',
  'hold_out',
]);
export type BreathPhase = z.infer<typeof BreathPhaseSchema>;

// ─────────────────────────────────────────────────────────────
// VR Nebula Session
// ─────────────────────────────────────────────────────────────

export const VRNebulaSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  scene: NebulaSceneSchema,
  breathing_pattern: BreathingPatternSchema,
  duration_s: z.number().min(0),
  resp_rate_avg: z.number().optional(),
  hrv_pre: z.number().optional(),
  hrv_post: z.number().optional(),
  rmssd_delta: z.number().optional(),
  coherence_score: z.number().min(0).max(100).optional(),
  cycles_completed: z.number().default(0),
  vr_mode: z.boolean().default(true),
  created_at: z.string(),
  updated_at: z.string(),
});
export type VRNebulaSession = z.infer<typeof VRNebulaSessionSchema>;

export const CreateVRNebulaSessionSchema = z.object({
  scene: NebulaSceneSchema,
  breathing_pattern: BreathingPatternSchema,
  vr_mode: z.boolean().default(true),
});
export type CreateVRNebulaSession = z.infer<typeof CreateVRNebulaSessionSchema>;

export const CompleteVRNebulaSessionSchema = z.object({
  session_id: z.string().uuid(),
  duration_s: z.number().min(0),
  resp_rate_avg: z.number().optional(),
  hrv_pre: z.number().optional(),
  hrv_post: z.number().optional(),
  cycles_completed: z.number().default(0),
});
export type CompleteVRNebulaSession = z.infer<typeof CompleteVRNebulaSessionSchema>;

// ─────────────────────────────────────────────────────────────
// State Machine
// ─────────────────────────────────────────────────────────────

export const VRNebulaStateSchema = z.object({
  phase: NebulaPhaseSchema,
  session: VRNebulaSessionSchema.nullable(),
  currentBreathPhase: BreathPhaseSchema.nullable(),
  breathCount: z.number().default(0),
  elapsedSeconds: z.number().default(0),
  currentHRV: z.number().optional(),
  coherenceLevel: z.number().min(0).max(100).default(0),
  error: z.string().nullable(),
});
export type VRNebulaState = z.infer<typeof VRNebulaStateSchema>;

// ─────────────────────────────────────────────────────────────
// Breathing Configuration
// ─────────────────────────────────────────────────────────────

export const BreathTimingSchema = z.object({
  inhale: z.number().min(1).max(10),
  hold_in: z.number().min(0).max(10),
  exhale: z.number().min(1).max(15),
  hold_out: z.number().min(0).max(10),
});
export type BreathTiming = z.infer<typeof BreathTimingSchema>;

export const NebulaConfigSchema = z.object({
  scene: NebulaSceneSchema.default('galaxy'),
  pattern: BreathingPatternSchema.default('coherence'),
  duration_minutes: z.number().min(1).max(30).default(10),
  vr_mode: z.boolean().default(true),
  audio_enabled: z.boolean().default(true),
  haptic_feedback: z.boolean().default(true),
  custom_timing: BreathTimingSchema.optional(),
});
export type NebulaConfig = z.infer<typeof NebulaConfigSchema>;

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export const VRNebulaStatsSchema = z.object({
  total_sessions: z.number(),
  total_minutes: z.number(),
  total_breaths: z.number(),
  average_coherence: z.number().min(0).max(100),
  average_hrv_gain: z.number(),
  favorite_scene: NebulaSceneSchema.nullable(),
  favorite_pattern: BreathingPatternSchema.nullable(),
  sessions_this_week: z.number(),
  sessions_this_month: z.number(),
  longest_session_minutes: z.number(),
  current_streak_days: z.number(),
});
export type VRNebulaStats = z.infer<typeof VRNebulaStatsSchema>;

// ─────────────────────────────────────────────────────────────
// Breath Timing Presets
// ─────────────────────────────────────────────────────────────

export const BREATH_PRESETS: Record<BreathingPattern, BreathTiming> = {
  box: { inhale: 4, hold_in: 4, exhale: 4, hold_out: 4 },
  coherence: { inhale: 5, hold_in: 0, exhale: 5, hold_out: 0 },
  relax: { inhale: 4, hold_in: 7, exhale: 8, hold_out: 0 },
  energize: { inhale: 3, hold_in: 0, exhale: 5, hold_out: 0 },
  calm: { inhale: 6, hold_in: 0, exhale: 6, hold_out: 0 },
};

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

export function getBreathTiming(pattern: BreathingPattern): BreathTiming {
  return BREATH_PRESETS[pattern];
}

export function calculateCycleDuration(timing: BreathTiming): number {
  return timing.inhale + timing.hold_in + timing.exhale + timing.hold_out;
}

export function calculateCoherenceScore(
  respRate: number,
  hrvDelta: number,
): number {
  // Cohérence optimale autour de 5.5-6 respirations/min
  const rateScore = Math.max(0, 100 - Math.abs(respRate - 5.5) * 10);
  
  // Gain HRV positif améliore le score
  const hrvScore = Math.min(100, Math.max(0, hrvDelta));
  
  return Math.round((rateScore * 0.6 + hrvScore * 0.4));
}
