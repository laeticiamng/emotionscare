/**
 * Breath Constellation Module - Respiration guidée avec visualisation constellation
 * 
 * @module breath-constellation
 */

import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// SERVICE
// ============================================================================

export { breathConstellationService, default as breathConstellationServiceDefault } from './breathConstellationService';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';
export type {
  BreathPhase,
  ConstellationType,
  SessionDifficulty,
  BreathConstellationConfig,
  BreathConstellationSession,
  CreateBreathConstellationSession,
  CompleteBreathConstellationSession,
  BreathConstellationStats,
  Star,
  ConstellationData,
} from './types';

// ============================================================================
// SCHEMAS
// ============================================================================

export {
  BreathPhaseSchema,
  ConstellationTypeSchema,
  SessionDifficultySchema,
  BreathConstellationConfigSchema,
  CreateBreathConstellationSessionSchema,
  CompleteBreathConstellationSessionSchema,
  CONSTELLATION_PRESETS,
} from './types';

// ============================================================================
// PAGE
// ============================================================================

export { default } from './BreathConstellationPage';
export { default as BreathConstellationPage } from './BreathConstellationPage';

export const LazyBreathConstellationPage = lazyDefault(
  () => import('./BreathConstellationPage'),
  'BreathConstellationPage'
);
