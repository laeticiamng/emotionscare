
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  threshold?: number;
  type?: string;
  imageUrl?: string;
  image_url?: string; // For backward compatibility
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  reward: number | string;
  status: 'active' | 'completed' | 'expired' | 'pending';
  type: string;
  expiresAt?: string;
  category?: string;
  title?: string; // For backward compatibility
  goal?: string; // Added goal property
}

export interface GamificationStats {
  points: number;
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
  nextLevel?: {
    points: number;
    rewards: any[];
  };
  achievements?: any[];
  
  // Additional properties for compatibility
  totalPoints?: number;
  currentLevel?: number;
  pointsToNextLevel?: number;
  badgesCount?: number;
  lastActivityDate?: string;
  totalChallenges?: number; // Added as optional
}

export interface LeaderboardEntry {
  userId: string;
  name?: string;
  avatarUrl?: string;
  points: number;
  rank: number;
  badges?: number; // Added badges property
  level: number;
  completedChallenges?: number;
}
