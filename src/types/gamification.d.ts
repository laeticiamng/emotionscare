
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imageUrl?: string;
  unlocked: boolean;
  progress?: number;
  threshold?: number;
  unlockedAt?: Date | string;
  user_id?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  reward?: Badge;
  deadline?: Date | string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  name?: string;
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
}
