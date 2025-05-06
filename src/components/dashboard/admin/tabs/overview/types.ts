
export interface ChartData {
  date: string;
  value: number;
}

export interface DashboardStats {
  activeUsersCount?: number;
  absentTeamMembers?: number;
  averageEmotionalScore?: number;
  activeGameifications?: number;
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
