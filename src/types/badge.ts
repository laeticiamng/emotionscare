
// Badge and gamification related types

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked?: boolean;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress?: number;
  goal?: number;
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
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  badges?: Badge[];
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  streakDays: number;
  progressToNextLevel?: number;
  nextLevelPoints: number;
}
