// @ts-nocheck

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  experience_points: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
  imageUrl?: string;
  category: BadgeCategory;
  points_required?: number;
  rarity?: BadgeRarity;
  conditions?: BadgeCondition[];
  unlocked?: boolean;
  unlockedAt?: string;
  progress?: number;
  threshold?: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: AchievementType;
  title: string;
  description: string;
  points_awarded: number;
  earned_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  activity_type: StreakType;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

export type BadgeCategory = 
  | 'emotion_mastery'
  | 'consistency'
  | 'social'
  | 'exploration'
  | 'achievement'
  | 'wellness'
  | 'emotion'
  | 'streak'
  | 'meditation'
  | 'tracking';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AchievementType = 
  | 'first_scan'
  | 'daily_streak'
  | 'weekly_goal'
  | 'emotion_balance'
  | 'social_connection'
  | 'music_discovery';

export type StreakType = 
  | 'daily_checkin'
  | 'emotion_scan'
  | 'journal_entry'
  | 'music_session'
  | 'breathing_exercise';

export interface BadgeCondition {
  type: 'activity_count' | 'streak_length' | 'score_threshold' | 'time_period';
  value: number;
  activity?: string;
}

export interface LevelConfig {
  level: number;
  min_points: number;
  max_points: number;
  title: string;
  benefits: string[];
  badge_unlock?: string;
}
