/**
 * Module Boss Grit (Bounce Battles)
 * Résilience et stratégies de coping
 * @version 1.1.0
 */

import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// SERVICE
// ============================================================================

export { BossGritService } from './bossGritService';

// ============================================================================
// TYPES
// ============================================================================

export type {
  BounceBattle,
  CopingResponse,
  BattleMode,
  BattleStatus,
  BounceEventType,
  BounceEventData,
  BounceEvent,
  BattleStats,
  BattleHistory,
  CreateBounceBattle,
  UpdateBounceBattle
} from './types';

// ============================================================================
// SCHEMAS (Zod)
// ============================================================================

export {
  BattleMode as BattleModeSchema,
  BattleStatus as BattleStatusSchema,
  BounceBattle as BounceBattleSchema,
  CopingResponse as CopingResponseSchema,
  BounceEventType as BounceEventTypeSchema,
  BounceEventData as BounceEventDataSchema,
  BounceEvent as BounceEventSchema
} from './types';

// ============================================================================
// UI COMPONENTS (Lazy loaded)
// ============================================================================

export { default } from './BossGritPage';
export { default as BossGritPage } from './BossGritPage';

export const LazyBossGritPage = lazyDefault(
  () => import('./BossGritPage'),
  'BossGritPage'
);
