
export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: string;
  points: number;
  streakDays: number;
  completedChallenges: number;
  unlockedBadges: number;
  totalChallenges: number;
  totalBadges: number;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string;
  description: string;
  progress: number;
  completed: boolean;
  status?: 'active' | 'completed' | 'locked';
  points?: number;
  goal?: number;
  total?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  deadline?: string;
  completions?: number;
  tags?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  achieved?: boolean;
  dateAchieved?: string;
  progress?: number;
  maxProgress?: number;
  tier?: string;
  total?: number;
  category?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}
