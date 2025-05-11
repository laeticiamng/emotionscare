
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  awarded_at?: Date | string;
  user_id?: string;
  criteria?: string;
  level?: number;
  category?: string;
  icon?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  completed: boolean;
  icon?: string;
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: {
    level: string;
    count: number;
  }[];
  topChallenges: {
    name: string;
    completions: number;
  }[];
}
