/**
 * Challenges Feature
 * 
 * Weekly challenges, progress tracking, and gamification challenges.
 * @module features/challenges
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { WeeklyChallengesPanel } from '@/components/challenges/WeeklyChallengesPanel';

// ============================================================================
// HOOKS
// ============================================================================

export { useWeeklyChallenges } from '@/hooks/useWeeklyChallenges';

// ============================================================================
// TYPES
// ============================================================================

export type { WeeklyChallenge, UserWeeklyProgress } from '@/hooks/useWeeklyChallenges';
