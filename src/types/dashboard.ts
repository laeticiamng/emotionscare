
import { Badge, Challenge, LeaderboardEntry } from './badge';

export type KpiCardStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning' | 'info' | 'default';

export interface KpiCardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  percentage?: number;
  subtitle?: string | React.ReactNode;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
  // Additional props needed by admin components
  delta?: {
    value: number;
    label?: string;
    trend: string;
  };
  status?: KpiCardStatus;
  isLoading?: boolean;
  ariaLabel?: string;
  footer?: React.ReactNode;
  id?: string;
  colorMode?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  // Grid layout properties
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
  icon?: string;
  label?: string;
  color?: string;
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'radar';
  title: string;
  data: any;
  period: 'day' | 'week' | 'month' | 'year';
}

export interface DashboardState {
  kpis: KpiCardData[];
  charts: ChartData[];
  badges: Badge[];
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: Error | null;
}

export interface DashboardWidgetData {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'badges' | 'challenges' | 'leaderboard' | 'custom';
  data: any;
  layout?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings?: Record<string, any>;
}

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  layout: 'grid' | 'list';
  widgets: DashboardWidgetData[];
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  className?: string;
  onSave?: (layouts: any) => void;
  savedLayout?: any;
  isEditable?: boolean;
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  settings?: Record<string, any>;
}

export interface GlobalOverviewTabProps {
  data?: any;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface GamificationData {
  points: number;
  level: number;
  badges: number;
  streak: number;
}

export type { LeaderboardEntry };
