
export interface GamificationSettings {
  points_per_action: number;
  badges_enabled: boolean;
  leaderboard_enabled: boolean;
  notifications_enabled: boolean;
  challenges_enabled: boolean;
  social_sharing_enabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  badges: string[];
  last_activity?: string;
  join_date?: string;
  profile_picture?: string;
  bio?: string;
  location?: string;
  interests?: string[];
}

export interface LeaderboardEntry {
  user_id: string;
  rank: number;
  points: number;
  level: number;
  username: string;
  profile_picture?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  badge_reward?: string;
  start_date: string;
  end_date: string;
  status: 'open' | 'in_progress' | 'completed' | 'failed';
  requirements: string[];
  name?: string; // Ajouté pour résoudre les erreurs
  total?: number; // Ajouté pour résoudre les erreurs
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'points' | 'badge' | 'challenge' | 'level_up';
  message: string;
  timestamp: string;
  is_read: boolean;
  related_item_id?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  image_url?: string; // Ajouté pour la compatibilité
  category: string;
  level?: number;
  unlocked: boolean;
  progress?: number;
  date_earned?: string;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirements?: string[];
  icon?: string; // Ajouté pour résoudre les erreurs
}

export interface GamificationLevel {
  id: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  badge?: string;
  benefits: string[];
}

export interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  badgesCount: number;
  completedChallenges: number;
  activeChallenges: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  streakDays: number;
  lastActivityDate: string | null;
}
