/**
 * Story Synth Module - Types & Schemas
 * Module de narration thérapeutique immersive
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums & Constants
// ─────────────────────────────────────────────────────────────

export const STORY_THEMES = ['healing', 'growth', 'resilience', 'acceptance', 'hope'] as const;
export const STORY_TONES = ['gentle', 'empowering', 'reflective', 'uplifting'] as const;
export const SESSION_PHASES = ['idle', 'generating', 'reading', 'completed', 'error'] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const StoryThemeSchema = z.enum(STORY_THEMES);
export const StoryToneSchema = z.enum(STORY_TONES);
export const SessionPhaseSchema = z.enum(SESSION_PHASES);

export const StoryContentSchema = z.object({
  title: z.string().min(1).max(200),
  paragraphs: z.array(z.string().min(1)),
  moral: z.string().optional(),
  reflection_prompts: z.array(z.string()).optional(),
});

export const StorySynthSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  theme: StoryThemeSchema,
  tone: StoryToneSchema,
  story_content: StoryContentSchema.nullable(),
  user_context: z.string().optional(),
  reading_duration_seconds: z.number().int().min(0),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export const CreateStorySynthSessionSchema = z.object({
  theme: StoryThemeSchema,
  tone: StoryToneSchema,
  user_context: z.string().max(500).optional(),
});

export const CompleteStorySynthSessionSchema = z.object({
  session_id: z.string().uuid(),
  reading_duration_seconds: z.number().int().min(0),
});

export const StorySynthStatsSchema = z.object({
  total_stories_read: z.number().int().min(0),
  total_reading_time_minutes: z.number().min(0),
  favorite_theme: StoryThemeSchema.nullable(),
  favorite_tone: StoryToneSchema.nullable(),
  completion_rate: z.number().min(0).max(100),
});

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────

export type StoryTheme = z.infer<typeof StoryThemeSchema>;
export type StoryTone = z.infer<typeof StoryToneSchema>;
export type SessionPhase = z.infer<typeof SessionPhaseSchema>;
export type StoryContent = z.infer<typeof StoryContentSchema>;
export type StorySynthSession = z.infer<typeof StorySynthSessionSchema>;
export type CreateStorySynthSession = z.infer<typeof CreateStorySynthSessionSchema>;
export type CompleteStorySynthSession = z.infer<typeof CompleteStorySynthSessionSchema>;
export type StorySynthStats = z.infer<typeof StorySynthStatsSchema>;

// ─────────────────────────────────────────────────────────────
// State Machine Types
// ─────────────────────────────────────────────────────────────

export interface StorySynthState {
  phase: SessionPhase;
  session: StorySynthSession | null;
  currentStory: StoryContent | null;
  startTime: number | null;
  error: string | null;
}
