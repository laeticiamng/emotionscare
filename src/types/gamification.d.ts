
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  completed?: boolean;
  unlocked?: boolean;
  progress?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  points?: number;
  progress: number;
  status: 'active' | 'completed' | 'failed' | 'locked';
  deadline?: string;
  isDaily?: boolean;
  isWeekly?: boolean;
  icon?: React.ReactNode;
  failed?: boolean;
  goal?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  username?: string;
  avatar?: string;
  points: number;
  level?: number;
  rank?: number;
  position?: number;
  progress?: number;
  change?: number;
  isCurrentUser?: boolean;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  completedChallenges: number;
  totalChallenges: number;
  challenges: Challenge[];
  streak: number;
  nextLevel: {
    points: number;
    level: number;
    rewards: string[];
  };
  progress: number;
  rewards?: string[];
}
