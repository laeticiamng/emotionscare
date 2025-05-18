
import { Badge, Challenge } from './badge';
import { UserRole } from './user';

export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  colorMode?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  // Add missing properties
  id?: string;
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
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  onSave?: (newLayout: any) => void;
  savedLayout?: any;
  // Add missing properties
  kpiCards?: KpiCardProps[];
  onLayoutChange?: (layout: any) => void;
  className?: string;
  isEditable?: boolean;
}

export interface GlobalOverviewTabProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
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
  // Add missing properties
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
  // Add missing properties
  username?: string;
  userId?: string;
}
