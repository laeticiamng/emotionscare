
import { Badge, Challenge } from './badge';
import { UserRole } from './user';

export interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  colorMode?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string | React.ReactNode;
  ariaLabel?: string;
  isLoading?: boolean;
  loading?: boolean;
  status?: 'success' | 'warning' | 'danger' | 'info';
  trendText?: string;
  // Props for DraggableKpiCardsGrid
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  onSave?: (newLayout: any) => void;
  savedLayout?: any;
  kpiCards?: KpiCardProps[];
  onLayoutChange?: (layout: any) => void;
  className?: string;
  isEditable?: boolean;
}

export interface GlobalOverviewTabProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: 'kpi' | 'chart' | 'table' | 'list';
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  data?: any;
  settings?: Record<string, any>;
}

export interface GamificationData {
  points: number;
  level: number;
  badges: Badge[];
  streak_days: number;
  last_activity_date?: string;
  emotion_counts?: Record<string, number>;
  current_challenges?: Challenge[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  rank: number;
  avatar?: string;
  department?: string;
  level?: number;
  trend?: number;
  username?: string;
  userId?: string;
}
