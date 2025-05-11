
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  progress?: number;
  category: string;
  icon?: string;
  requirements?: string[];
  completedAt?: string;
  name?: string;
  total?: number;
  difficulty?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category: string;
  level: number;
  unlocked: boolean;
  unlocked_at?: string;
  user_id?: string;
  progress?: number;
}

export interface AchievementStat {
  name: string;
  value: number;
  max?: number;
  unit?: string;
  percentage?: number;
}

export interface LevelInfo {
  current: number;
  next: number;
  progress: number;
  pointsToNextLevel: number;
  totalPoints: number;
}
