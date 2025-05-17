
import { Badge } from '@/types';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'failed' | 'locked' | 'ongoing' | 'active' | 'available';
  category: string;
  progress?: number;
  goal?: number;
  icon?: string;
  level?: string | number;
  name?: string;
  completions?: number;
  deadline?: string;
  totalSteps?: number;
  completed?: boolean;
}

export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  streak: number;
  nextLevelPoints: number;
  progress: number;
  recentAchievements?: Badge[];
}
