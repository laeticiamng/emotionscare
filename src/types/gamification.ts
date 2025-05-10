
// Types for gamification-related components
export * from './index';

export interface BadgeProgress {
  currentValue: number;
  threshold: number;
  percentage: number;
}

export interface UserAchievement {
  badge_id: string;
  user_id: string;
  earned_at: string;
  progress?: number;
}
