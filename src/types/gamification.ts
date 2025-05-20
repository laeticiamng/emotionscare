
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
  user_id?: string; // Added this property
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
  progressToNextLevel?: number; // Added this property
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  threshold: number;
  completed: boolean;
  category: string;
  type?: string; // Added this property
  name?: string; // Added this property for backward compatibility
  userId?: string;
  reward?: any;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
}
