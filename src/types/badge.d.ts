
// Define badge types for the application
export interface Badge {
  id: string; 
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  unlockedAt: string | null;
  progress?: number;
  totalPoints?: number;
  level?: number;
  isUnlocked?: boolean;
}

// Challenge type for gamification features
export interface Challenge {
  id: string;
  name: string;
  title?: string;
  description: string;
  points: number;
  progress: number;
  goal: number;
  category: string;
  completed: boolean;
  status: string;
  totalSteps: number;
  icon: string;
  reward: string;
  unlocked: boolean;
}

export interface BadgeCollection {
  recent: Badge[];
  all: Badge[];
}
