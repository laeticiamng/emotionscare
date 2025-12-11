/**
 * Story Synth Module - Narration thérapeutique immersive et adaptative
 */

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export * as storySynthService from './storySynthServiceUnified';
export { StorySynthServiceEnriched } from './storySynthServiceUnified';

// ============================================================================
// HOOKS
// ============================================================================

export { useStorySynthMachine } from './useStorySynthMachine';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';
export type { StorySynthState, StorySynthPhase } from './types';
export type {
  EnrichedStorySynthSession,
  NarrativeArc,
  StorySegment,
  Choice,
  UserChoice,
  EmotionalImpactPoint,
  PersonalizedStory,
} from './storySynthServiceUnified';

// ============================================================================
// PAGE
// ============================================================================

import { lazyDefault } from '@/lib/lazyDefault';

export { default } from './StorySynthPage';
export { default as StorySynthPage } from './StorySynthPage';

export const LazyStorySynthPage = lazyDefault(
  () => import('./StorySynthPage'),
  'StorySynthPage'
);
