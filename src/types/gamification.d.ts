
export interface GamificationStats {
  points: number;
  level: number;
  rank: number;
  streak: number;
  nextLevel: number;
  nextLevelPoints: number;
  progressToNextLevel: number;
  achievements: Achievement[];
  badges: Badge[];
  challenges: Challenge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  recentAchievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image_url: string;
  earned_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  earned_at?: string;
  level?: number; // Some badges have levels
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  points: number;
  progress: number;
  total: number;
  expires_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  avatar_url: string;
  points: number;
  rank: number;
  level?: number;  // For compatibility
  position?: number; // For compatibility
}
