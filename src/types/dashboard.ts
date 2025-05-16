
import { ReactNode } from 'react';

export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: ReactNode;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  className?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  trendText?: string;
  loading?: boolean;
  isLoading?: boolean;
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
}

export interface GlobalOverviewTabProps {
  period: string;
  setPeriod: (period: string) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'list' | 'table' | 'custom';
  size: 'sm' | 'md' | 'lg' | 'full';
  data?: any;
  component?: ReactNode;
  visible?: boolean;
  order?: number;
}

export interface GamificationData {
  badges: number;
  level: number;
  points: number;
  nextLevelPoints: number;
  progress: number;
  streaks: {
    current: number;
    longest: number;
  };
  recentAchievements: Array<{
    id: string;
    name: string;
    description: string;
    date: string;
  }>;
}
