
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string; 
  unlockedAt?: string;
  level?: number;
  category?: string; // Add category to fix type errors
}

export type ChallengeStatus = 
  | 'completed' 
  | 'ongoing' 
  | 'available'
  | 'active'    // Adding missing status types
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
  total?: number; // Add total to fix type errors
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
  // Added for compatibility with existing code
  totalPoints?: number;
  currentLevel?: number;
  badgesCount?: number;
  pointsToNextLevel?: number;
  lastActivityDate?: string | null;
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
