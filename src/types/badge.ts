
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  image_url?: string; // Adding for backward compatibility
  level: number;
  category?: string;
  unlocked?: boolean;
  unlockedAt?: string; // Adding this field to fix type errors
  unlocked_at?: string; // Adding this field to fix type errors
  progress?: number;
  requiredPoints?: number;
  threshold?: number; // Adding this field to fix type errors
  color?: string;
  icon?: string;
  dateEarned?: string;
}

export interface Challenge {
  id: string;
  title: string;
  name?: string; // Adding this field to fix type errors
  description: string;
  points: number;
  completed?: boolean;
  progress?: number;
  total?: number;
  goal?: number; // Adding this field to fix type errors
  completions?: number; // Adding this field to fix type errors
  totalSteps?: number; // Adding this field to fix type errors
  category?: string;
  deadline?: string;
  reward?: string;
  imageUrl?: string;
  icon?: string;
  difficulty?: string; // Adding this field to fix type errors
}

export interface GamificationData {
  level: number;
  points: number;
  nextLevel: number;
  badges: Badge[];
  challenges: Challenge[];
  streakDays: number;
  emotionalBalance: number;
}
