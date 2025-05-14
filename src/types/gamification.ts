
export interface GamificationStats {
  points: number;
  level: number;
  rank: string;
  badges: Badge[];
  challenges: Challenge[];
  streak: number;
  nextLevel: {
    points: number;
    rewards: string[];
  };
  achievements: Achievement[];
  // Additional properties needed by GamificationDashboard
  currentLevel: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  totalPoints: number;
  badgesCount: number;
  streakDays: number;
  lastActivityDate?: string;
  activeChallenges: number;
  completedChallenges: number;
  nextLevelPoints?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'locked' | 'active' | 'ongoing' | 'available';
  category: string;
  type?: string;
  progress?: number;
  goal?: number;
  icon?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  completed?: boolean;
  total?: number;
  level?: string | number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon?: string;
  threshold?: number;
  type?: string;
  image?: string;
  date?: string;
  level?: string | number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  points: number;
  icon?: string;
}

export interface GamificationAction {
  type: 'SCAN' | 'JOURNAL' | 'COACH' | 'VR' | 'CHALLENGE' | 'STREAK' | 'LOGIN';
  data?: any;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  badges: number;
  streak: number;
  department?: string;
}
