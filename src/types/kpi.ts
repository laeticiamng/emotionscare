
export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export interface KpiMetrics {
  totalUsers: number;
  activeUsers: number;
  sessionsToday: number;
  emotionalScore: number;
  completionRate: number;
  growthRate: number;
}
