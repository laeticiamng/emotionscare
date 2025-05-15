
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
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onReorder?: (cards: KpiCardProps[]) => void;
  editable?: boolean;
}

export interface GlobalOverviewTabProps {
  period?: 'day' | 'week' | 'month' | 'year';
  showTrends?: boolean;
  isLoading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list' | 'map' | 'custom';
  title: string;
  width: 1 | 2 | 3 | 4; // Grid width (out of 4 columns)
  height: 'sm' | 'md' | 'lg' | 'xl'; // Height size
  position: number; // Order in dashboard
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
