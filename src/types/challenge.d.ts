
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'achievement' | 'streak' | 'ongoing' | 'community' | 'educational';
  points: number;
  progress: number;
  target: number;
  completed: boolean;
  imageUrl?: string;
  createdAt?: string;
  expiresAt?: string;
  completedAt?: string;
  badgeId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
  progress?: number;
  target?: number;
}

export interface GamificationStats {
  level: number;
  points: number;
  totalBadges: number;
  completedChallenges: number;
  activeChallenges: number;
  streakDays: number;
  progressToNextLevel?: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  rank: number;
  avatarUrl?: string;
  badges?: number;
  achievements?: number;
  isCurrentUser?: boolean;
}

export interface ChallengeUpdateResult {
  success: boolean;
  challenge?: Challenge;
  badge?: Badge | null;
  message?: string;
}

export interface BadgeService {
  getUserBadges: (userId: string) => Promise<Badge[]>;
  awardBadge: (userId: string, badgeId: string) => Promise<boolean>;
  getBadgeProgress: (userId: string, badgeId: string) => Promise<{ progress: number, target: number }>;
}

export interface ChallengeService {
  getUserChallenges: (userId: string) => Promise<Challenge[]>;
  updateChallenge: (challengeId: string, update: Partial<Challenge>) => Promise<boolean>;
  completeChallenge: (challengeId: string) => Promise<ChallengeUpdateResult>;
  getActiveChallenges: (userId: string) => Promise<Challenge[]>;
  getCompletedChallenges: (userId: string) => Promise<Challenge[]>;
}
