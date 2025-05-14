
export interface GamificationStats {
  id?: string;
  userId?: string;
  points?: number;
  level?: number;
  rank?: string;
  badges?: Badge[];
  streak?: number;
  totalSessions?: number;
  totalEmotionScans?: number;
  completedChallenges?: number;
  recentAchievements?: {
    id: string;
    name: string;
    date: string;
    points: number;
    description: string;
  }[];
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name?: string;
  avatarUrl?: string;
  points: number;
  rank: number;
  level: number;
  department?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  type?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  completed: boolean;
  type: string;
}
