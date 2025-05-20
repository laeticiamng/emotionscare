
// Types liés aux badges et gamification

export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  unlocked: boolean;
  progress?: number;
  category?: string;
  timestamp?: string;
  icon?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  rarity?: string;
  imageUrl?: string;
  earned?: boolean;
  earnedAt?: string;
  level?: number;
  threshold?: number;
  completed?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  points: number;
  reward?: Badge | string;
  progress: number;
  goal: number;
  status: 'active' | 'completed' | 'locked';
  category?: string;
  unlocked: boolean;
  type?: string;
  difficulty?: string;
  completions?: number;
  total?: number;
  deadline?: string;
  totalSteps?: number;
  isCompleted?: boolean;
  icon?: string;
  rarity?: string; // Added to fix mock data
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username?: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  badges: Badge[];
  progress?: number;
  score?: number;
  position?: number;
}

export interface GamificationStats {
  points: number;
  badges: number;
  level: number;
  completedChallenges: number;
  activeChallenges: number;
  rank?: number;
  streaks?: Record<string, number>;
  achievements?: Badge[];
  progressToNextLevel?: number;
}
