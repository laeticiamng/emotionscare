
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  user_id?: string;
  unlocked_at?: string;
  earned_at?: string;
  progress?: number;
  level?: number;
  unlocked?: boolean;
  category?: string;
  type?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  requirements?: string[];
  completed?: boolean;
  progress?: number;
  deadline?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  level?: number;
  name?: string;
  total?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  completed?: boolean;
}

export interface EmotionBadge {
  id: string;
  name: string;
  description: string;
  type: 'achievement' | 'emotion' | 'diversity' | 'balance' | 'streak';
  icon: string;
  threshold: number;
  emotionCount?: number;
  emotion?: string;
  streakDays?: number;
}

export interface GamificationLevel {
  currentLevel: number;
  nextLevel: number;
  progress: number;
  points: number;
  pointsToNextLevel: number;
}
