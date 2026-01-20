/**
 * Feature: Mood Management
 * Gestion de l'humeur et publication d'événements mood
 */

// Event Bus
export { MOOD_UPDATED, publishMoodUpdated, type MoodEventDetail, type MoodQuadrant } from './mood-bus';

// Hooks
export { useMoodPublisher } from './useMoodPublisher';
export { useSamOrchestration } from './useSamOrchestration';

// Re-exports from hooks for compatibility
export { useMood } from '@/hooks/useMood';
export { useMoodSession } from '@/hooks/useMoodSession';
export { useCurrentMood } from '@/hooks/useCurrentMood';
