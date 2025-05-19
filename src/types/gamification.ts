
import { Badge } from './badge';

export interface Challenge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  points?: number;
  progress?: number;
  goal?: number;
  category?: string;
  completed?: boolean;
  status?: string;
  difficulty?: string;
  completions?: number;
  total?: number;
  deadline?: string;
  reward: any;
  unlocked: boolean;
  totalSteps?: number;
  isCompleted?: boolean;
  icon?: string; // Added to support existing code
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  points: number;
  position: number;
  name?: string;
  avatarUrl?: string;
  badges?: Badge[];
  rank?: number; // Added to support existing code
  score?: number; // Added to support existing code
  avatar?: string; // Added to support existing code
}

// Export Badge from here as well for compatibility
export { Badge };

// Add GamificationStats interface for UserSidePanel
export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  nextLevelPoints: number;
  progress: number;
  completedChallenges?: number;
  totalChallenges?: number;
  activeChallenges?: number;
  streakDays?: number;
  longestStreak?: number;
  unlockedBadges?: number;
  totalBadges?: number;
  recentAchievements?: Badge[];
}
