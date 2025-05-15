
// Types liés au dashboard
export interface DashboardWidgetConfig {
  id: string;
  type: string;
  title?: string;
  position?: number;
  size?: 'small' | 'medium' | 'large' | 'full';
  settings?: {
    [key: string]: any;
    title?: string;
    value?: string;
    trend?: string;
  };
}

export interface DashboardKpi {
  id: string;
  title: string;
  value: string | number | React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  color?: string;
}

export interface DashboardShortcut {
  id: string;
  title: string;
  icon?: React.ReactNode;
  path: string;
  color?: string;
  onClick?: () => void;
}

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
