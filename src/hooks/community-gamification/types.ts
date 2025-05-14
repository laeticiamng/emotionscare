
export type ChallengeStatus = 'available' | 'active' | 'completed' | 'expired' | 'ongoing';

export interface Challenge {
  id: string;
  name: string;
  title: string; // Required field
  description: string;
  points: number;
  status: ChallengeStatus;
  progress?: number;
  total?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
  completed?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  earnedAt: string | null;
}

export interface Achievement {
  type: 'badge' | 'challenge';
  id: string;
  name: string;
  date: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challenges: Challenge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  totalPoints: number;
  currentLevel: number;
  badgesCount: number;
  pointsToNextLevel: number;
  recentAchievements: Achievement[];
}
