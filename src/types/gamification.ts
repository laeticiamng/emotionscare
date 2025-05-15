import { Period } from './types';

export interface Challenge {
  id: string;
  title?: string;
  name?: string; // Added for compatibility with ChallengesList
  description: string;
  points: number;
  progress: number;
  goal?: number; // Added for compatibility with ChallengesList
  total?: number; // Added for compatibility with ChallengesList
  completed?: boolean;
  status?: 'active' | 'completed' | 'failed'; // Added for compatibility with ChallengesList
  type?: string;
  category?: string;
  timeLeft?: number;
  startDate?: string;
  endDate?: string;
  reward?: string;
  user_id?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  category?: string;
  level?: string | number;
  points?: number;
  user_id?: string;
  icon_url?: string;
  total_required?: number;
  image?: string;
  dateEarned?: string;
  awarded_at?: Date | string;
  unlockedAt?: Date | string; // Add for compatibility
  progress?: number; // Add for compatibility
}

export interface GamificationStats {
  level: number;
  points: number;
  badges: Badge[] | number; // Make it flexible to accept both Badge[] and number
  streak: number;
  completedChallenges: number;
  totalChallenges: number;
  
  // Additional properties used in GamificationDashboard.tsx
  currentLevel?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  totalPoints?: number;
  badgesCount?: number;
  streakDays?: number;
  lastActivityDate?: string;
  activeChallenges?: number;
  
  // Other optional properties
  rank?: string;
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  challenges?: Challenge[];
  achievements?: any[];
  recentAchievements?: any[];
  nextLevelPoints?: number;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  avatar_url?: string;
  points: number;
  rank: number;
  level: number;
  badges_count: number;
  challenges_completed: number;
  department?: string;
}

export interface GamificationSettings {
  enabled: boolean;
  showPoints: boolean;
  showLeaderboard: boolean;
  showAchievements: boolean;
  showChallenges: boolean;
  notificationsEnabled: boolean;
}
