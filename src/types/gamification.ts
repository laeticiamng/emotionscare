
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  image_url?: string; // For backward compatibility
  icon_url?: string; // For backward compatibility
  image?: string; // For backward compatibility
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | string;
  unlockedAt?: string;
  unlocked?: boolean; // For backward compatibility
  completed?: boolean;
  progress?: number;
  level?: number; // For backward compatibility
}

export interface Challenge {
  id: string;
  title: string;
  name?: string; // For backward compatibility
  description: string;
  category: string;
  points: number;
  deadline?: string;
  status: 'active' | 'completed' | 'failed' | string;
  progress: number;
  goal?: number; // For backward compatibility
  total?: number; // For backward compatibility
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  completions?: number;
  type?: string;
  completed?: boolean; // Add this field for backward compatibility
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  department?: string;
}

export interface GamificationStats {
  points: number;
  level: number;
  badges: Badge[];
  challenges: Challenge[];
  totalBadges?: number; // For backward compatibility
  activeUsersPercent?: number; // For backward compatibility
  completionRate?: number; // For backward compatibility
  topChallenges?: Challenge[]; // For backward compatibility
  totalChallenges?: number; // For backward compatibility
  completedChallenges?: number; // For backward compatibility
  badgeLevels?: { [key: string]: number } | { level: string; count: number }[]; // For backward compatibility
  currentLevel?: number; // For backward compatibility
  pointsToNextLevel?: number; // For backward compatibility
  progressToNextLevel?: number; // For backward compatibility
  streak?: number;
  streakDays?: number; // For backward compatibility
  lastActivityDate?: string; // For backward compatibility
  activeChallenges?: number; // For backward compatibility 
  badgesCount?: number; // For backward compatibility
  totalPoints?: number; // For backward compatibility
  progress?: number; // For backward compatibility
  leaderboard?: LeaderboardEntry[]; // For backward compatibility
  nextLevel?: number; // For backward compatibility
}

export interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => Promise<boolean>;
  showFilter?: boolean;
  showTitle?: boolean;
  className?: string;
}

export interface BadgesWidgetProps {
  badges: Badge[];
  title?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
  className?: string;
}

export interface BadgeGridProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
  className?: string;
  showEmpty?: boolean;
}
