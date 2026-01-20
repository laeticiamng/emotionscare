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
export { useDailyChallenges } from '@/hooks/useDailyChallenges';
export { useCustomChallenges } from '@/hooks/useCustomChallenges';
export { useChallengeModule } from '@/hooks/useChallengeModule';
export { useChallengesHistory } from '@/hooks/useChallengesHistory';
export { useGritChallenge } from '@/hooks/useGritChallenge';
export { useNeonChallenge } from '@/hooks/useNeonChallenge';

// ============================================================================
// TYPES
// ============================================================================
export type { WeeklyChallenge, UserWeeklyProgress } from '@/hooks/useWeeklyChallenges';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'custom';
  category: string;
  xp_reward: number;
  target: number;
  progress: number;
  completed: boolean;
  expires_at?: string;
}

export interface ChallengeProgress {
  challenge_id: string;
  user_id: string;
  progress: number;
  completed_at?: string;
  streak: number;
}
