
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
