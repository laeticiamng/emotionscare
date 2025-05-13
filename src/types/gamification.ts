
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl?: string; 
  image?: string;
  unlockedAt?: string;
  level?: number;
  category?: string;
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
  name: string;
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
  title?: string; // Adding for backward compatibility
  type?: string;   // Adding for backward compatibility
  completed?: boolean;
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
  challenges?: Challenge[];
  recentAchievements?: Badge[];
  challengesCompleted?: number; // For backward compatibility
  streak?: number;  // For backward compatibility
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
