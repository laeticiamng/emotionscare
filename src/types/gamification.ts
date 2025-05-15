
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level?: number;
  category?: string;
  earnedDate?: string;
  progress?: number;
  total?: number;
  requirements?: Record<string, number | string>;
  image_url?: string;
  imageUrl?: string;
  icon_url?: string;
  unlocked?: boolean;
  unlockedAt?: Date | string;
  type?: string;
  dateEarned?: string;
  awarded_at?: Date | string;
}

export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  completed: boolean;
  icon?: string;
  category?: string;
  dueDate?: string;
  progress?: number;
  completedOn?: string;
  participants?: number;
  status?: string;
  goal?: number;
  total?: number;
  type?: string;
  completions?: number; // Added for admin dashboard
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  score: number;
  rank: number;
  avatarUrl?: string;
  name?: string;
  user_id?: string;
  user_name?: string;
  avatar_url?: string;
  progress?: number;
  level?: number;
}

export interface GamificationStats {
  points: number;
  level: number;
  progress: number;
  badges: Badge[];
  challenges: Challenge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  streak: number;
  nextLevelPoints: number;
  
  // Admin dashboard specific properties
  activeUsersPercent?: number;
  totalBadges?: number;
  badgeLevels?: Array<{ level: string; count: number }>;
  topChallenges?: Array<Challenge & { name: string; completions: number }>;
  
  // Additional properties used in components
  completedChallenges?: number;
  totalChallenges?: number;
  activeChallenges?: number;
  streakDays?: number;
  totalPoints?: number;
  badgesCount?: number;
  currentLevel?: number;
  pointsToNextLevel?: number;
  progressToNextLevel?: number;
  lastActivityDate?: string;
  rank?: string;
  completion_rate?: number;
  participation_rate?: number;
  nextLevel?: {
    points: number;
    rewards: string[];
  };
  recentAchievements?: any[];
}

export interface GamificationPreferences {
  notificationsEnabled: boolean;
  challengeReminders: boolean;
  publicProfile: boolean;
  competitionEnabled: boolean;
  focusMode: 'productivity' | 'wellbeing' | 'balance';
}
