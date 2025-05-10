
// Create this file if it doesn't exist
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category?: string;
  unlocked?: boolean;
  unlock_date?: Date | string;
  progress?: number;
  total_required?: number;
  image_url?: string;
  level?: number;
  xp_reward?: number;
  user_id?: string;  // Added missing property
  created_at?: Date | string;
}

export interface BadgeGroup {
  id: string;
  name: string;
  badges: Badge[];
}

export interface BadgeStatistics {
  total: number;
  unlocked: number;
  percentage: number;
  recent?: Badge[];
}
