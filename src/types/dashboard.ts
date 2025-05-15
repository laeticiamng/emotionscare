
import { ReactNode } from 'react';
import { GamificationStats } from './gamification';

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  className?: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number | ReactNode;
  trend?: number;
  icon?: ReactNode;
  description?: string;
  status?: 'positive' | 'negative' | 'neutral' | 'warning';
  onClick?: () => void;
  className?: string;
  trendText?: string;
  details?: string;
  period?: string;
  loading?: boolean;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: ReactNode;
  ariaLabel?: string;
  isLoading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  width: number;
  height: number;
  x: number;
  y: number;
  minW?: number;
  minH?: number;
  visible: boolean;
  settings?: {
    dataSource?: string;
    refreshInterval?: number;
    displayMode?: string;
    showLabels?: boolean;
    colorScheme?: string;
    [key: string]: any;
  };
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
  absenteeismChartData?: any[];
  emotionalScoreTrend?: any[];
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationStats;
  isLoading?: boolean;
}

export interface ChartData {
  date: string;
  value: number;
  category?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  averageEmotionalScore?: number;
  absenteeismRate?: number;
  activeToday?: number;
  averageScore?: number;
  criticalAlerts?: number;
  completion?: number;
  productivity?: {
    current: number;
    trend: number;
  };
  emotionalScore?: {
    current: number;
    trend: number;
  };
}

export interface GamificationData extends GamificationStats {
  totalBadges: number;
  activeChallenges: number;
  leaderboard: {
    userId: string;
    name: string;
    score: number;
    position: number;
  }[];
  recentAchievements: {
    userId: string;
    name: string;
    badge: string;
    date: string;
  }[];
}
