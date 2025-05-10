
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

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'milestone' | 'achievement' | 'challenge' | 'streak';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  threshold: number;
  category: string;
  color: string;
}

export interface Report {
  id: string;
  user_id: string;
  type: 'daily' | 'weekly' | 'monthly';
  date: string | Date;
  data: Record<string, any>;
  insights: string[];
  recommendations: string[];
}
