
export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  image_url?: string; // Add for compatibility
  level: number;
  category: string;
  earned: boolean;
  earned_at?: string;
  requirements?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  progress: number;
  total: number;
  completed: boolean;
  completed_at?: string;
}

export interface GamificationStats {
  points: number; // Add missing properties
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  recentAchievements: Achievement[];
  totalExperience: number;
  nextLevelExperience: number;
  currentLevelExperience: number;
  progress: number;
  dailyGoalMet: boolean;
  weeklyStreak: number;
  longestStreak: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string; // Add missing property
  user_id: string;
  avatar?: string;
  points: number;
  level: number;
  rank: string;
  streak: number;
  position: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  deadline?: string;
  completed: boolean;
  progress: number;
  total: number;
}

export interface UserReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: string;
  redeemed: boolean;
  redeemed_at?: string;
  expiry?: string;
}
