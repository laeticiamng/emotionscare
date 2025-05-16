
export type BadgeCategory = 'achievement' | 'wellness' | 'activity' | 'social' | 'milestone' | 'special';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type ChallengeCategory = 'daily' | 'weekly' | 'monthly' | 'special' | 'wellness' | 'social' | 'activity';
export type ChallengeStatus = 'active' | 'completed' | 'expired' | 'upcoming';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  image?: string; // Backward compatibility
  image_url?: string; // Backward compatibility
  icon_url?: string; // Backward compatibility
  category: BadgeCategory;
  tier: BadgeTier;
  level?: number; // For tiered badges
  unlockedAt?: string;
  completed?: boolean;
  progress?: number;
  unlocked?: boolean; // Backward compatibility
}

export interface Challenge {
  id: string;
  title: string;
  name: string;
  description: string;
  category: ChallengeCategory;
  points: number;
  progress: number;
  completions: number;
  status: ChallengeStatus;
  difficulty?: ChallengeDifficulty;
  deadline?: string;
  goal?: number;
  total?: number;
  completed?: boolean; // For backward compatibility
  isDaily?: boolean; // For backward compatibility
  isWeekly?: boolean; // For backward compatibility
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  progress?: number; 
  previousRank?: number;
  isCurrentUser?: boolean;
  trend?: 'up' | 'down' | 'same';
}

export interface GamificationStats {
  points: number;
  level: number;
  nextLevel?: number;
  badges: Badge[];
  challenges: Challenge[];
  streak?: number;  // Days in a row with activity
  streakDays?: number; // For backward compatibility
  currentLevel?: number; // For backward compatibility
  pointsToNextLevel?: number; // For backward compatibility
  progressToNextLevel?: number; // For backward compatibility
  lastActivityDate?: string; // For backward compatibility
  activeChallenges?: Challenge[]; // For backward compatibility
  badgesCount?: number; // For backward compatibility
  totalPoints?: number; // For backward compatibility
  totalBadges?: number; // For backward compatibility
  completedChallenges?: number; // For backward compatibility
  totalChallenges?: number; // For backward compatibility
  activeUsersPercent?: number; // For backward compatibility
  completionRate?: number; // For backward compatibility
  topChallenges?: Challenge[]; // For backward compatibility 
  leaderboard?: LeaderboardEntry[]; // For backward compatibility
  badgeLevels?: { level: string, count: number }[]; // For admin dashboard
  progress?: number; // For backward compatibility
}
