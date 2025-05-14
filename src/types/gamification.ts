
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: number;
  status: 'active' | 'completed' | 'locked';
  due?: string;
  imageUrl?: string;
  icon?: string;
  name?: string; // For backward compatibility
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  date: string;
  imageUrl?: string;
  points?: number;
  category?: string; // For backward compatibility
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: Challenge[];
  recentAchievements: Achievement[];
}
