
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
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
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
