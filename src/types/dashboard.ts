
export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  delta?: number | { value: number; label?: string; trend: 'up' | 'down' | 'neutral' };
  status?: KpiCardStatus;
  icon?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
}

export interface GlobalOverviewTabProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description?: string;
  type: string;
  size?: 'small' | 'medium' | 'large';
  refreshInterval?: number;
  permissions?: string[];
  dataSource?: string;
  settings?: Record<string, any>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  content?: React.ReactNode;
  type?: string;
  data?: any;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  error?: Error | null;
  refresh?: () => void;
  lastUpdated?: Date;
  config?: DashboardWidgetConfig;
}

export interface GamificationData {
  badges: number;
  streak: number;
  points: number;
  level: number;
  nextLevelProgress: number;
  achievements: { name: string; date: string }[];
}

export type KpiCardStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface KpiDelta {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface KpiCardsGridProps {
  cards: Array<{
    id: string;
    title: string;
    value: string | number;
    delta?: KpiDelta | number;
    status?: KpiCardStatus;
    icon?: React.ReactNode;
    subtitle?: string | React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    isLoading?: boolean;
    onClick?: () => void;
  }>;
}

export interface TeamSummary {
  id: string;
  name: string;
  members: number;
  department?: string;
  activity?: number;
  engagement?: number;
  emotionAverage?: number;
  averageEmotionalScore?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export interface AdminAccessLog {
  id: string;
  action: string;
  timestamp: string | Date;
  details?: string;
  userId?: string;
  adminName?: string;
  ip?: string;
  status?: 'success' | 'failed' | 'pending';
}
