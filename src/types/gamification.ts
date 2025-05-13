
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
  status?: 'active' | 'completed' | 'expired';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  dateEarned: string;
}

export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badges: Badge[];
  challengesCompleted: number;
  streak: number;
  
  // Add missing properties based on GamificationDashboard usage
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
