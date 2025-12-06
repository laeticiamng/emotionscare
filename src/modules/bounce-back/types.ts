/**
 * Bounce Back Module - Types & Zod Schemas
 * Module de résilience et coping avec mécaniques de jeu
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────

export const BATTLE_STATUSES = ['created', 'active', 'paused', 'completed', 'abandoned'] as const;
export const BATTLE_MODES = ['standard', 'quick', 'zen', 'challenge'] as const;
export const EVENT_TYPES = ['thought', 'emotion', 'action', 'obstacle', 'victory'] as const;
export const COPING_QUESTIONS = [
  'distraction',
  'reframing',
  'support',
  'relaxation',
  'problem_solving',
] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schemas
// ─────────────────────────────────────────────────────────────

export const BattleStatusSchema = z.enum(BATTLE_STATUSES);
export const BattleModeSchema = z.enum(BATTLE_MODES);
export const EventTypeSchema = z.enum(EVENT_TYPES);
export const CopingQuestionSchema = z.enum(COPING_QUESTIONS);

export const BounceBattleSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  status: BattleStatusSchema,
  mode: BattleModeSchema,
  started_at: z.string().datetime().nullable(),
  ended_at: z.string().datetime().nullable(),
  duration_seconds: z.number().int().min(0).nullable(),
  created_at: z.string().datetime(),
});

export const BounceEventSchema = z.object({
  id: z.string().uuid(),
  battle_id: z.string().uuid(),
  event_type: EventTypeSchema,
  timestamp: z.number().int().min(0),
  event_data: z.record(z.unknown()).default({}),
});

export const BounceCopingResponseSchema = z.object({
  id: z.string().uuid(),
  battle_id: z.string().uuid(),
  question_id: CopingQuestionSchema,
  response_value: z.number().int().min(1).max(5),
  created_at: z.string().datetime(),
});

export const BouncePairTipSchema = z.object({
  id: z.string().uuid(),
  battle_id: z.string().uuid(),
  pair_token: z.string(),
  tip_content: z.string().nullable(),
  received_tip: z.string().nullable(),
  sent_at: z.string().datetime(),
});

// ─────────────────────────────────────────────────────────────
// Create/Update Schemas
// ─────────────────────────────────────────────────────────────

export const CreateBounceBattleSchema = z.object({
  mode: BattleModeSchema.default('standard'),
});

export const StartBounceBattleSchema = z.object({
  battle_id: z.string().uuid(),
});

export const CompleteBounceBattleSchema = z.object({
  battle_id: z.string().uuid(),
  duration_seconds: z.number().int().min(0),
});

export const AddBounceEventSchema = z.object({
  battle_id: z.string().uuid(),
  event_type: EventTypeSchema,
  timestamp: z.number().int().min(0),
  event_data: z.record(z.unknown()).optional().default({}),
});

export const AddCopingResponseSchema = z.object({
  battle_id: z.string().uuid(),
  question_id: CopingQuestionSchema,
  response_value: z.number().int().min(1).max(5),
});

export const SendPairTipSchema = z.object({
  battle_id: z.string().uuid(),
  pair_token: z.string(),
  tip_content: z.string().min(1).max(500),
});

// ─────────────────────────────────────────────────────────────
// Stats Schemas
// ─────────────────────────────────────────────────────────────

export const BounceStatsSchema = z.object({
  total_battles: z.number().int().min(0),
  completed_battles: z.number().int().min(0),
  completion_rate: z.number().min(0).max(100),
  total_duration_seconds: z.number().int().min(0),
  average_duration_seconds: z.number().min(0),
  total_events: z.number().int().min(0),
  average_events_per_battle: z.number().min(0),
  coping_strategies_avg: z.record(z.number().min(1).max(5)),
  favorite_mode: BattleModeSchema.nullable(),
});

// ─────────────────────────────────────────────────────────────
// TypeScript Types
// ─────────────────────────────────────────────────────────────

export type BattleStatus = z.infer<typeof BattleStatusSchema>;
export type BattleMode = z.infer<typeof BattleModeSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;
export type CopingQuestion = z.infer<typeof CopingQuestionSchema>;

export type BounceBattle = z.infer<typeof BounceBattleSchema>;
export type BounceEvent = z.infer<typeof BounceEventSchema>;
export type BounceCopingResponse = z.infer<typeof BounceCopingResponseSchema>;
export type BouncePairTip = z.infer<typeof BouncePairTipSchema>;

export type CreateBounceBattle = z.infer<typeof CreateBounceBattleSchema>;
export type StartBounceBattle = z.infer<typeof StartBounceBattleSchema>;
export type CompleteBounceBattle = z.infer<typeof CompleteBounceBattleSchema>;
export type AddBounceEvent = z.infer<typeof AddBounceEventSchema>;
export type AddCopingResponse = z.infer<typeof AddCopingResponseSchema>;
export type SendPairTip = z.infer<typeof SendPairTipSchema>;

export type BounceStats = z.infer<typeof BounceStatsSchema>;
