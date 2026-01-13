/**
 * Story Synth Module - Index TypeScript
 * Re-exports depuis index.tsx pour compatibilité
 * 
 * @module story-synth
 */

// Tout est exporté depuis index.tsx, ce fichier sert de pont
export * from './types';
export { storySynthService } from './storySynthServiceUnified';
export type {
  EnrichedStorySynthSession,
  NarrativeArc,
  StorySegment,
  Choice,
  UserChoice,
  EmotionalImpactPoint,
  PersonalizedStory,
} from './storySynthServiceUnified';
