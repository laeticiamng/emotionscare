
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string; // Add this for backward compatibility
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number | string;
  status: 'active' | 'completed' | 'expired';
  type: string;
  expiresAt?: string;
  category?: string;
}

export interface GamificationStats {
  points: number; // Add required properties
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  nextLevelPoints: number;
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: Challenge[];
  recentAchievements: Badge[];
  nextLevel: {
    points: number;
    rewards: any[];
  };
  achievements: any[];
}

export interface LeaderboardEntry {
  userId: string;
  name?: string; // Add name property
  avatarUrl: string;
  points: number;
  rank: number;
  badges: number;
  level: number;
  completedChallenges: number;
}
