/**
 * Story Synth Module Types
 * Narration thérapeutique immersive
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

export const StoryThemeSchema = z.enum([
  'calme',
  'aventure',
  'poetique',
  'mysterieux',
  'romance',
  'introspection',
  'nature',
]);
export type StoryTheme = z.infer<typeof StoryThemeSchema>;

export const StoryToneSchema = z.enum([
  'apaisant',
  'encourageant',
  'contemplatif',
  'joyeux',
  'nostalgique',
  'esperant',
]);
export type StoryTone = z.infer<typeof StoryToneSchema>;

export const StoryPovSchema = z.enum(['je', 'il', 'elle', 'nous']);
export type StoryPov = z.infer<typeof StoryPovSchema>;

export const StoryStyleSchema = z.enum(['sobre', 'lyrique', 'journal', 'dialogue']);
export type StoryStyle = z.infer<typeof StoryStyleSchema>;

export const StorySynthPhaseSchema = z.enum([
  'idle',
  'generating',
  'reading',
  'pausing',
  'completed',
  'error',
]);
export type StorySynthPhase = z.infer<typeof StorySynthPhaseSchema>;

// ─────────────────────────────────────────────────────────────
// Story Content
// ─────────────────────────────────────────────────────────────

export const StoryParagraphSchema = z.object({
  id: z.string(),
  text: z.string(),
  emphasis: z.enum(['normal', 'soft', 'strong']).optional(),
});
export type StoryParagraph = z.infer<typeof StoryParagraphSchema>;

export const StoryContentSchema = z.object({
  title: z.string(),
  paragraphs: z.array(StoryParagraphSchema),
  estimated_duration_seconds: z.number().optional(),
  ambient_music: z.string().optional(),
});
export type StoryContent = z.infer<typeof StoryContentSchema>;

// ─────────────────────────────────────────────────────────────
// Story Synth Session
// ─────────────────────────────────────────────────────────────

export const StorySynthSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  theme: StoryThemeSchema,
  tone: StoryToneSchema,
  user_context: z.string().optional(),
  story_content: StoryContentSchema.optional(),
  reading_duration_seconds: z.number().default(0),
  completed_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type StorySynthSession = z.infer<typeof StorySynthSessionSchema>;

export const CreateStorySynthSessionSchema = z.object({
  theme: StoryThemeSchema,
  tone: StoryToneSchema,
  user_context: z.string().optional(),
});
export type CreateStorySynthSession = z.infer<typeof CreateStorySynthSessionSchema>;

export const CompleteStorySynthSessionSchema = z.object({
  session_id: z.string().uuid(),
  reading_duration_seconds: z.number().min(0),
});
export type CompleteStorySynthSession = z.infer<typeof CompleteStorySynthSessionSchema>;

// ─────────────────────────────────────────────────────────────
// State Machine
// ─────────────────────────────────────────────────────────────

export const StorySynthStateSchema = z.object({
  phase: StorySynthPhaseSchema,
  session: StorySynthSessionSchema.nullable(),
  currentStory: StoryContentSchema.nullable(),
  startTime: z.number().nullable(),
  pausedAt: z.number().nullable().optional(),
  error: z.string().nullable(),
});
export type StorySynthState = z.infer<typeof StorySynthStateSchema>;

// ─────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────

export const StorySynthStatsSchema = z.object({
  total_stories_read: z.number(),
  total_reading_time_minutes: z.number(),
  favorite_theme: StoryThemeSchema.nullable(),
  favorite_tone: StoryToneSchema.nullable(),
  completion_rate: z.number(),
});
export type StorySynthStats = z.infer<typeof StorySynthStatsSchema>;

// ─────────────────────────────────────────────────────────────
// Story Generation Config
// ─────────────────────────────────────────────────────────────

export const StoryGenerationConfigSchema = z.object({
  theme: StoryThemeSchema,
  tone: StoryToneSchema,
  pov: StoryPovSchema.default('je'),
  style: StoryStyleSchema.default('sobre'),
  protagonist: z.string().default('Alex'),
  location: z.string().default('la ville'),
  length: z.number().min(3).max(10).default(5),
  seed: z.string().optional(),
  user_context: z.string().optional(),
});
export type StoryGenerationConfig = z.infer<typeof StoryGenerationConfigSchema>;
