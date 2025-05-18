
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  level: number;
  category?: string;
  unlocked?: boolean;
  progress?: number;
  requiredPoints?: number;
  color?: string;
  icon?: string;
  dateEarned?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed?: boolean;
  progress?: number;
  total?: number;
  category?: string;
  deadline?: string;
  reward?: string;
  imageUrl?: string;
  icon?: string;
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
