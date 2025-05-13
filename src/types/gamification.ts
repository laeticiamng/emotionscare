
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  completed: boolean;
  progress: number;
  category: string;
  points: number;
  deadline?: string;
  status?: 'active' | 'completed' | 'expired' | 'ongoing' | 'available' | 'in_progress' | 'open';
  name?: string;
  total?: number; // Adding this property which is used in community-gamification
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  dateEarned: string;
  imageUrl?: string;
}

export interface GamificationStats {
  // Original properties
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challengesCompleted: number;
  streak: number;
  
  // Additional properties used in the application
  currentLevel: number;
  totalPoints: number;
  pointsToNextLevel: number;
  progressToNextLevel: number;
  badgesCount: number;
  streakDays: number;
  lastActivityDate: string;
  activeChallenges: number;
  completedChallenges: number;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  points: number;
  level: number;
  rank: number;
  avatar_url?: string;
}
