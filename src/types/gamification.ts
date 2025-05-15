
// Types liés à la gamification
export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  rank: number;
  streak: number;
  nextLevel: number;
  achievements: any[];
  badges: any[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  challenges: any[];
  recentAchievements: any[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level?: number;
  unlockedAt?: Date;
  progress?: number;
  total?: number;
  color?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  complete: boolean;
  icon: string;
  dueDate?: Date;
  category?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year' | 'all';
