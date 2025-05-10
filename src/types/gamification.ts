
import { Badge } from './badge';

export interface GamificationProgress {
  user_id: string;
  total_points: number;
  level: number;
  badges: Badge[];
  streak_days: number;
  last_activity: Date | string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  deadline?: Date | string;
}
