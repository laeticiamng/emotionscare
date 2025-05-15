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
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon?: string;
  category?: string;
  dueDate?: string;
  progress?: number;
  completedOn?: string;
  participants?: number;
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
  // Add missing properties
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: { [key: string]: number };
  topChallenges: Challenge[];
  completionRate?: number;
  participationRate?: number;
}

export interface GamificationPreferences {
  notificationsEnabled: boolean;
  challengeReminders: boolean;
  publicProfile: boolean;
  competitionEnabled: boolean;
  focusMode: 'productivity' | 'wellbeing' | 'balance';
}
