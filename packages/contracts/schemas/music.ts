import { z } from 'zod';

/**
 * Music Generation Schemas
 * These schemas are shared between frontend and backend for music therapy features
 */

// Emotion state schema
export const emotionStateSchema = z.object({
  valence: z.number().min(-1).max(1),
  arousal: z.number().min(-1).max(1),
  dominantEmotion: z.string().optional(),
  labels: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
});

// Suno music configuration schema
export const sunoMusicConfigSchema = z.object({
  customMode: z.boolean(),
  instrumental: z.boolean(),
  title: z.string().min(1).max(200),
  style: z.string().min(1).max(500),
  prompt: z.string().max(1000).optional(),
  model: z.enum(['V3_5', 'V4', 'V4_5', 'V4_5PLUS', 'V5']).default('V4_5'),
  negativeTags: z.string().max(200).optional(),
  vocalGender: z.enum(['m', 'f']).nullable().optional(),
  styleWeight: z.number().min(0).max(1).optional(),
  weirdnessConstraint: z.number().min(0).max(1).optional(),
  audioWeight: z.number().min(0).max(1).optional(),
  durationSeconds: z.number().int().min(30).max(300).optional(),
  callBackUrl: z.string().url().optional(),
});

// Suno track schema
export const sunoTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  audioUrl: z.string().url().optional(),
  streamUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  model: z.string(),
  style: z.string(),
});

// Suno generation result schema
export const sunoGenerationResultSchema = z.object({
  taskId: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  tracks: z.array(sunoTrackSchema).optional(),
});

// Music generation session schema
export const musicGenerationSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  taskId: z.string(),
  emotionState: emotionStateSchema,
  emotionBadge: z.string(),
  sunoConfig: sunoMusicConfigSchema,
  result: sunoGenerationResultSchema.optional(),
  createdAt: z.date(),
  completedAt: z.date().optional(),
});

// Schema for creating a music generation request
export const createMusicGenerationSchema = z.object({
  emotionState: emotionStateSchema,
  emotionBadge: z.string().min(1),
  config: sunoMusicConfigSchema,
});

// Schema for listing music generation sessions
export const listMusicSessionsSchema = z.object({
  limit: z.number().int().positive().max(50).default(10),
  offset: z.number().int().nonnegative().default(0),
  status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
  sortBy: z.enum(['createdAt', 'completedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type EmotionState = z.infer<typeof emotionStateSchema>;
export type SunoMusicConfig = z.infer<typeof sunoMusicConfigSchema>;
export type SunoTrack = z.infer<typeof sunoTrackSchema>;
export type SunoGenerationResult = z.infer<typeof sunoGenerationResultSchema>;
export type MusicGenerationSession = z.infer<typeof musicGenerationSessionSchema>;
export type CreateMusicGenerationInput = z.infer<typeof createMusicGenerationSchema>;
export type ListMusicSessionsInput = z.infer<typeof listMusicSessionsSchema>;
