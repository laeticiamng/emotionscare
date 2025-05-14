
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; 
  image?: string;
  unlockedAt?: string;
  level?: number;
  category?: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  type?: string;
}

export type ChallengeStatus = 
  | 'completed' 
  | 'ongoing' 
  | 'available'
  | 'active'
  | 'expired'
  | 'in_progress'
  | 'open';

export interface Challenge {
  id: string;
  name?: string;
  description: string;
  points: number;
  startDate?: string;
  endDate?: string;
  status: ChallengeStatus;
  progress?: number;
  category?: string;
  badgeId?: string;
  imageUrl?: string;
  total?: number;
  title: string; 
  type?: string;
  completed?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string;
  category?: string;
  image_url?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  badges: Badge[];
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel: number;
  totalPoints?: number;
  currentLevel?: number;
  badgesCount?: number;
  pointsToNextLevel?: number;
  lastActivityDate?: string | null;
  challenges: Challenge[]; 
  recentAchievements: Badge[];
  challengesCompleted?: number;
  streak?: number;
}

export interface GamificationLevel {
  level: number;
  pointsRequired: number;
  title: string;
  benefits?: string[];
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  points: number;
  level: number;
  position: number;
  badges: number;
  completedChallenges: number;
}
