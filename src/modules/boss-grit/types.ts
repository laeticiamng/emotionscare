/**
 * Module Boss Grit (Bounce Battles) - Types
 * Types pour le module de résilience et stratégies de coping
 */

import { z } from 'zod';

// ============================================================================
// BATTLE MODES
// ============================================================================

export const BattleMode = z.enum(['standard', 'challenge', 'timed']);
export type BattleMode = z.infer<typeof BattleMode>;

export const BattleStatus = z.enum(['created', 'in_progress', 'completed', 'cancelled']);
export type BattleStatus = z.infer<typeof BattleStatus>;

// ============================================================================
// BOUNCE BATTLE
// ============================================================================

export const BounceBattle = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  mode: BattleMode,
  status: BattleStatus,
  duration_seconds: z.number().int().positive().optional(),
  started_at: z.string().datetime().optional(),
  ended_at: z.string().datetime().optional(),
  created_at: z.string().datetime()
});
export type BounceBattle = z.infer<typeof BounceBattle>;

// ============================================================================
// COPING RESPONSE
// ============================================================================

export const CopingResponse = z.object({
  id: z.string().uuid(),
  battle_id: z.string().uuid(),
  question_id: z.string(),
  response_value: z.number().int().min(1).max(10),
  created_at: z.string().datetime()
});
export type CopingResponse = z.infer<typeof CopingResponse>;

// ============================================================================
// BATTLE EVENTS
// ============================================================================

export const BounceEventType = z.enum([
  'battle_started',
  'question_answered',
  'milestone_reached',
  'battle_paused',
  'battle_resumed',
  'battle_completed',
  'battle_abandoned',
  'power_up_used',
  'achievement_unlocked'
]);
export type BounceEventType = z.infer<typeof BounceEventType>;

export const BounceEventData = z.object({
  action: z.string().optional(),
  value: z.number().optional(),
  question_id: z.string().optional(),
  milestone_type: z.string().optional(),
  power_up_type: z.string().optional(),
  achievement_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});
export type BounceEventData = z.infer<typeof BounceEventData>;

export const BounceEvent = z.object({
  id: z.string().uuid().optional(),
  battle_id: z.string().uuid(),
  event_type: BounceEventType,
  timestamp: z.number().int().positive(),
  event_data: BounceEventData.optional()
});
export type BounceEvent = z.infer<typeof BounceEvent>;

// ============================================================================
// BATTLE STATISTICS
// ============================================================================

export interface BattleStats {
  user_id: string;
  total_battles: number;
  completed_battles: number;
  completion_rate: number;
  average_duration_seconds: number;
  best_time_seconds: number;
  total_questions_answered: number;
  average_response_value: number;
  modes_played: Record<BattleMode, number>;
  milestones_reached: number;
  last_battle_date: string;
}

export interface BattleHistory {
  battles: BounceBattle[];
  total_count: number;
  completion_rate: number;
  average_duration: number;
}

// ============================================================================
// CREATE / UPDATE
// ============================================================================

export interface CreateBounceBattle {
  user_id: string;
  mode?: BattleMode;
}

export interface UpdateBounceBattle {
  status?: BattleStatus;
  duration_seconds?: number;
  started_at?: string;
  ended_at?: string;
}
