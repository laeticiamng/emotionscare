
import { ReactNode } from 'react';

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
  value: string | number;
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
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
  absenteeismChartData?: any[];
  emotionalScoreTrend?: any[];
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationData;
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
  averageEmotionalScore: number;
  absenteeismRate: number;
}

export interface GamificationData {
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
