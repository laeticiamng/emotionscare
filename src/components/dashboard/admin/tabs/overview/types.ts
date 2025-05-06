
export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
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
  badgeLevels?: Array<{ level: string; count: number }>;
  topChallenges?: Array<{ name: string; completions: number }>;
}
