
// Badge and gamification related types

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
  image_url?: string;
  unlocked?: boolean;
  earned?: boolean;
  achieved?: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress?: number;
  goal?: number;
  category?: string;
  date_earned?: string;
  dateAwarded?: string;
  unlockedAt?: string;
  unlocked_at?: string;
  timestamp?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  reward: string;
  progress: number;
  goal?: number;
  status: 'active' | 'completed' | 'failed' | 'locked';
  category: string;
  unlocked?: boolean;
  totalSteps?: number;
  name?: string;
  completed?: boolean;
  total?: number;
  completions?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  deadline?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  username?: string;
  points: number;
  rank: number;
  avatar?: string;
  badges?: Badge[];
  score?: number;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  streakDays: number;
  nextLevelPoints: number;
  progressToNextLevel?: number;
}
