
export interface TeamSummary {
  id: string;
  name: string;
  memberCount: number;
  activeUsers: number;
  averageScore?: number;
  emotionalAverage?: string;
  count?: number;
  trend?: number;
  averageEmotionalScore?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  trendValue?: number;
  department?: string;
  leaderName?: string;
  lastUpdated?: Date;
}

export interface AdminAccessLog {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  userName?: string;
  adminName?: string;
  resource?: string;
  details?: string;
  ip?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
  width?: number;
  height?: number;
  settings?: Record<string, any>;
}

export type DashboardWidgetConfig = DashboardWidget & {
  x: number;
  y: number;
  visible: boolean;
  settings?: Record<string, any>;
};

export type KpiCardStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type KpiDelta = {
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  direction?: 'up' | 'down' | 'stable';
  label?: string;
};

export interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  delta?: number | KpiDelta;
  icon?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  className?: string;
  status?: KpiCardStatus;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (newOrder: KpiCardProps[]) => void;
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  onSave?: (layouts: any) => void;
  savedLayout?: any;
  className?: string;
  isEditable?: boolean;
  onLayoutChange?: (layout: any) => void;
}

export interface GlobalOverviewTabProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
  data?: any;
  isLoading?: boolean;
  className?: string;
}

export interface KpiCardsGridProps {
  cards?: KpiCardProps[];
}
