
export interface GamificationStats {
  level: number;
  points: number;
  nextLevelPoints: number;
  badgesCount: number; // For GamificationDashboard
  totalPoints: number; // For GamificationDashboard
  pointsToNextLevel: number; // For GamificationDashboard
  streak: number;
  completed_challenges: number;
  available_challenges: number;
  recent_achievements: {
    id: string;
    name: string;
    acquired_at: string;
    points: number;
    icon?: string;
  }[];
}

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  points: number;
  level: number;
  avatar_url?: string;
  rank: number;
  is_current_user?: boolean;
}
