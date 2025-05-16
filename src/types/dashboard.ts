
import { ReactNode } from 'react';
import { GamificationStats } from './gamification';

export interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  onClick?: () => void;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  } | number;
  subtitle?: ReactNode | string;
  ariaLabel?: string;
  isLoading?: boolean;
  className?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  trendText?: string;
  loading?: boolean;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  onReorder?: (cards: KpiCardProps[]) => void;
  editable?: boolean;
  kpiCards?: KpiCardProps[];
  className?: string;
  isEditable?: boolean;
  onLayoutChange?: (layout: any[]) => void;
}

export interface GlobalOverviewTabProps {
  period?: 'day' | 'week' | 'month' | 'year';
  showTrends?: boolean;
  isLoading?: boolean;
  kpiCards?: KpiCardProps[];
  absenteeismChartData?: Array<{ date: string; value: number }>;
  emotionalScoreTrend?: Array<{ date: string; value: number }>;
  dashboardStats?: any;
  gamificationData?: GamificationStats;
}

export interface DashboardWidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list' | 'map' | 'custom';
  title: string;
  width: 1 | 2 | 3 | 4;
  height: 'sm' | 'md' | 'lg' | 'xl';
  position: number;
  visible: boolean;
  settings?: {
    [key: string]: any;
  };
}

export interface GamificationData {
  stats: GamificationStats;
  challengeHistory?: {
    date: string;
    completions: number;
  }[];
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}
