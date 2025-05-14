
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: string;
  unlocked: boolean;
  unlock_date?: string;
  level?: number; // Adding the level property
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  status: 'active' | 'completed' | 'failed' | 'locked' | 'ongoing' | 'available';
  deadline?: string;
  progress?: number;
  completedAt?: string;
  requirements?: string[];
}

export interface GamificationStats {
  level: number;
  points: number;
  rank: string;
  badges: Badge[];
  completedChallenges: number;
  streak: number;
  nextLevel: number;
  pointsToNextLevel: number;
  progress: number;
  achievements: Badge[];
  recentAchievements?: Badge[]; // Adding recentAchievements
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  delta?: number; 
  badge?: string;
  level?: number; // Adding level property
}
