/**
 * Module Scores - Point d'entrée
 * Système de scores émotionnels, wellbeing et engagement
 * @version 2.0.0
 */

import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// SERVICE
// ============================================================================

export {
  ScoresService,
  scoresService,
  default as scoresServiceDefault
} from './scoresService';

// ============================================================================
// HOOK
// ============================================================================

export { useScores } from './useScores';

// ============================================================================
// TYPES
// ============================================================================

export type {
  UserScore,
  ScoreComponents,
  ScoreHistory,
  VibeType,
  VibeMetrics,
  CurrentVibe,
  WeeklyMetrics,
  ScoreCalculationInput,
  ScoreCalculationResult,
  ScoreInsight,
  ScoreInsights,
  LeaderboardEntry,
  LeaderboardPeriod,
  ScoreStatistics
} from './types';

// ============================================================================
// SCHEMAS (Zod)
// ============================================================================

export {
  UserScore as UserScoreSchema,
  ScoreHistory as ScoreHistorySchema,
  VibeType as VibeTypeSchema,
  VibeMetrics as VibeMetricsSchema,
  LeaderboardPeriod as LeaderboardPeriodSchema
} from './types';

// ============================================================================
// UI COMPONENTS (Lazy loaded)
// ============================================================================

export { default } from './ScoresV2Page';
export { default as ScoresV2Page } from './ScoresV2Page';
export { default as ScoresV2Panel } from './ScoresV2Panel';

export const LazyScoresV2Page = lazyDefault(
  () => import('./ScoresV2Page'),
  'ScoresV2Page'
);
