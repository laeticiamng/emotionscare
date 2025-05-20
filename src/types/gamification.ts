
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  threshold?: number;
  user_id?: string;
  imageUrl?: string;
  earned?: boolean;
  achieved?: boolean;
}

export interface GamificationStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  consecutiveLogins: number;
  totalSessions: number;
  totalMoodEntries: number;
  totalMeditationMinutes: number;
  badges: Badge[];
  achievements: string[];
  streakDays: number;
  progressToNextLevel?: number;
  points?: number;
  longestStreak?: number;
  completedChallenges?: number;
  totalChallenges?: number;
  unlockedBadges?: number;
  totalBadges?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  threshold: number;
  completed: boolean;
  category: string;
  type?: string;
  name?: string;
  userId?: string;
  reward?: any;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  goal?: string;
  targetValue?: number;
  currentValue?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  rank: number;
  points?: number;
  progress?: number;
  level?: number;
  position?: number;
}
