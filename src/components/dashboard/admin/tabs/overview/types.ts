
export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeToday: number;
  averageScore: number;
  criticalAlerts: number;
  completion: number;
  productivity: {
    current: number;
    trend: number;
  };
  emotionalScore: {
    current: number;
    trend: number;
  };
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: {
    level: string;
    count: number;
  }[];
  topChallenges: {
    name: string;
    completions: number;
  }[];
}
