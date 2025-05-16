
export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  rank: string;
  points: number;
  streakDays: number;
  longestStreak?: number;
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
  category?: string;
  completedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
  unlocked?: boolean;
  achieved?: boolean;
  achievedAt?: string;
  dateAchieved?: string;
  progress?: number;
  maxProgress?: number;
  tier?: string;
  total?: number;
  category?: string;
  icon?: React.ReactNode;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
}
