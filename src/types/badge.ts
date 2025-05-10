
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url: string;
  category: 'achievement' | 'milestone' | 'challenge' | 'special';
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
  points?: number;
  earned_at?: string | Date;
  requirements?: BadgeRequirement[];
}

export interface BadgeRequirement {
  type: 'journal_count' | 'mood_tracking' | 'consecutive_days' | 'community_engagement';
  count: number;
  completed?: boolean;
}
