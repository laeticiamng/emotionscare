/**
 * AI Coach Module - Types & Zod Schemas
 * Module de coaching IA personnalisé
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

export const COACH_PERSONALITIES = [
  'empathetic',
  'motivational',
  'analytical',
  'zen',
  'energetic',
] as const;

export const SESSION_STATUSES = ['active', 'paused', 'completed', 'abandoned'] as const;

export const MESSAGE_ROLES = ['user', 'assistant', 'system'] as const;

export const TECHNIQUE_TYPES = [
  'breathing',
  'meditation',
  'cognitive_reframing',
  'grounding',
  'progressive_relaxation',
  'mindfulness',
  'gratitude',
] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const CoachPersonalitySchema = z.enum(COACH_PERSONALITIES);
export const SessionStatusSchema = z.enum(SESSION_STATUSES);
export const MessageRoleSchema = z.enum(MESSAGE_ROLES);
export const TechniqueTypeSchema = z.enum(TECHNIQUE_TYPES);

export const CoachMessageSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.unknown()).optional().default({}),
});

export const EmotionDetectedSchema = z.object({
  emotion: z.string(),
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
});

export const ResourceProvidedSchema = z.object({
  title: z.string(),
  type: z.enum(['article', 'video', 'exercise', 'tool', 'external']),
  url: z.string().url().optional(),
  description: z.string().optional(),
});

export const CoachSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  coach_personality: CoachPersonalitySchema,
  session_duration: z.number().int().min(0),
  messages_count: z.number().int().min(0),
  emotions_detected: z.array(EmotionDetectedSchema).default([]),
  techniques_suggested: z.array(TechniqueTypeSchema).default([]),
  resources_provided: z.array(ResourceProvidedSchema).default([]),
  user_satisfaction: z.number().int().min(1).max(5).nullable(),
  session_notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// ─────────────────────────────────────────────────────────────
// Create/Update Schemas
// ─────────────────────────────────────────────────────────────

export const CreateCoachSessionSchema = z.object({
  coach_personality: CoachPersonalitySchema.default('empathetic'),
});

export const UpdateCoachSessionSchema = z.object({
  session_id: z.string().uuid(),
  session_duration: z.number().int().min(0).optional(),
  messages_count: z.number().int().min(0).optional(),
  emotions_detected: z.array(EmotionDetectedSchema).optional(),
  techniques_suggested: z.array(TechniqueTypeSchema).optional(),
  resources_provided: z.array(ResourceProvidedSchema).optional(),
  user_satisfaction: z.number().int().min(1).max(5).optional(),
  session_notes: z.string().optional(),
});

export const AddCoachMessageSchema = z.object({
  session_id: z.string().uuid(),
  role: MessageRoleSchema,
  content: z.string().min(1).max(5000),
  metadata: z.record(z.unknown()).optional(),
});

export const SendCoachMessageSchema = z.object({
  session_id: z.string().uuid(),
  message: z.string().min(1).max(2000),
});

export const CompleteCoachSessionSchema = z.object({
  session_id: z.string().uuid(),
  user_satisfaction: z.number().int().min(1).max(5),
  session_notes: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────
// Stats Schemas
// ─────────────────────────────────────────────────────────────

export const CoachStatsSchema = z.object({
  total_sessions: z.number().int().min(0),
  completed_sessions: z.number().int().min(0),
  total_duration_seconds: z.number().int().min(0),
  average_duration_seconds: z.number().min(0),
  total_messages: z.number().int().min(0),
  average_messages_per_session: z.number().min(0),
  average_satisfaction: z.number().min(1).max(5).nullable(),
  favorite_personality: CoachPersonalitySchema.nullable(),
  most_detected_emotions: z.array(z.string()).default([]),
  most_suggested_techniques: z.array(TechniqueTypeSchema).default([]),
});

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────

export type CoachPersonality = z.infer<typeof CoachPersonalitySchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type TechniqueType = z.infer<typeof TechniqueTypeSchema>;

export type CoachMessage = z.infer<typeof CoachMessageSchema>;
export type EmotionDetected = z.infer<typeof EmotionDetectedSchema>;
export type ResourceProvided = z.infer<typeof ResourceProvidedSchema>;
export type CoachSession = z.infer<typeof CoachSessionSchema>;

export type CreateCoachSession = z.infer<typeof CreateCoachSessionSchema>;
export type UpdateCoachSession = z.infer<typeof UpdateCoachSessionSchema>;
export type AddCoachMessage = z.infer<typeof AddCoachMessageSchema>;
export type SendCoachMessage = z.infer<typeof SendCoachMessageSchema>;
export type CompleteCoachSession = z.infer<typeof CompleteCoachSessionSchema>;

export type CoachStats = z.infer<typeof CoachStatsSchema>;

// ─────────────────────────────────────────────────────────────
// Internal Types
// ─────────────────────────────────────────────────────────────

/**
 * Données partielles pour mise à jour de session
 */
export interface SessionUpdateData {
  updated_at: string;
  session_duration?: number;
  messages_count?: number;
  emotions_detected?: EmotionDetected[];
  techniques_suggested?: TechniqueType[];
  resources_provided?: ResourceProvided[];
  user_satisfaction?: number;
  session_notes?: string;
}
