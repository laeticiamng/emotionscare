/**
 * Feature: Gamification - Index enrichi
 * XP, badges, achievements, leaderboards, challenges
 */

// Types
export * from './types';

// Hooks
export { useXPSystem } from './hooks/useXPSystem';
export { useGamification } from '@/hooks/useGamification';
export { useBadges } from '@/hooks/useBadges';
export { useLeaderboard } from '@/hooks/useLeaderboard';
export { useRewards } from '@/hooks/useRewards';
export { useStreakTracker } from '@/hooks/useStreakTracker';
export { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
export { useAdvancedLeaderboard } from '@/hooks/useAdvancedLeaderboard';
export { useGlobalLeaderboard } from '@/hooks/useGlobalLeaderboard';
export { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';

// Components
export { XPProgressBar } from './components/XPProgressBar';
export { BadgeCard } from './components/BadgeCard';
export { StreakTracker } from './components/StreakTracker';

// Store
export { useGamificationStore } from '@/store/gamification.store';
