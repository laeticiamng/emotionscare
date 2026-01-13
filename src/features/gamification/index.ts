/**
 * Feature: Gamification
 * XP, badges, achievements, leaderboards
 */

// Hooks
export { useGamification } from '@/hooks/useGamification';
export { useBadges } from '@/hooks/useBadges';
export { useLeaderboard } from '@/hooks/useLeaderboard';
export { useRewards } from '@/hooks/useRewards';
export { useStreakTracker } from '@/hooks/useStreakTracker';
export { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
export { useAdvancedLeaderboard } from '@/hooks/useAdvancedLeaderboard';
export { useGlobalLeaderboard } from '@/hooks/useGlobalLeaderboard';
export { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';

// Store
export { useGamificationStore } from '@/store/gamification.store';

// Types
export interface UserProgress {
  user_id: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  total_xp: number;
  streak_days: number;
  longest_streak: number;
  harmony_points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlocked_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_at?: string;
  xp_reward: number;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  score: number;
  level: number;
}

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'alltime';
export type LeaderboardType = 'xp' | 'streak' | 'activities' | 'harmony';
