/**
 * Story Synth Module - Narration thérapeutique immersive et adaptative
 * @module story-synth
 */

import { lazyDefault } from '@/lib/lazyDefault';

// ============================================================================
// SERVICE UNIFIÉ
// ============================================================================

export { storySynthService, StorySynthServiceEnriched } from './storySynthServiceUnified';

// ============================================================================
// HOOKS
// ============================================================================

export { useStorySynthMachine } from './useStorySynthMachine';
export { useStorySynthEnriched } from './useStorySynthEnriched';
export type { 
  UseStorySynthEnrichedReturn,
  StorySynthSessionEnriched,
  StoryGenerationConfig,
  StorySynthAchievement,
} from './useStorySynthEnriched';

// ============================================================================
// COMPOSANTS
// ============================================================================

export { StoryCard } from './components/StoryCard';
export { StoryStats } from './components/StoryStats';
export { StoryGeneratorForm } from './components/StoryGeneratorForm';
export { StoryReader } from './components/StoryReader';
export { StoryLibrary } from './components/StoryLibrary';

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

export { default } from './StorySynthPage';
export { default as StorySynthPage } from './StorySynthPage';

export const LazyStorySynthPage = lazyDefault(
  () => import('./StorySynthPage'),
  'StorySynthPage'
);
