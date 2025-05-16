
export interface Badge {
  id: string;
  name: string;
  description: string;
  category?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  imageUrl?: string;
  image_url?: string;
  image?: string;
  icon_url?: string;
  unlockedAt?: string;
  unlocked?: boolean;
  completed?: boolean;
  progress?: number;
}

export interface GamificationStats {
  totalBadges?: number;
  unlockedBadges?: number;
  badges?: Badge[];
  activeUsers?: number;
  activeUsersPercent?: number;
  completionRate?: number;
  streakDays?: number;
  level?: number;
  xp?: number;
  nextLevelXp?: number;
  totalChallenges?: number;
  completedChallenges?: number;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points?: number;
  progress: number;
  goal: number;
  completed?: boolean;
  failed?: boolean;
  category?: string;
  type?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  total?: number;
  status: 'active' | 'completed' | 'failed';
}
