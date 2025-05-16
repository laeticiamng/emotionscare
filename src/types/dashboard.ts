
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: ReactNode | LucideIcon;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string | ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  isLoading?: boolean;
  loading?: boolean;
  trendText?: string;
  // Grid position props for drag and drop
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
  onLayoutChange?: (layout: any[]) => void;
  className?: string;
  isEditable?: boolean;
  editable?: boolean;
}

export interface GlobalOverviewTabProps {
  period?: string;
  department?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list' | 'custom';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position?: number;
  data?: any;
  settings?: any;
  visible?: boolean;
}

export interface GamificationData {
  badges: any[];
  points: number;
  level: number;
  achievements: any[];
  streaks: number;
  challenges: any[];
}
