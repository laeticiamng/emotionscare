
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stat' | 'table' | 'activity';
  size: 'small' | 'medium' | 'large' | 'full';
  data?: any;
  position?: { x: number; y: number; w: number; h: number };
}

export interface AdminAccessLog {
  id: string;
  userId: string;
  userName: string;
  adminId?: string;
  action: string;
  resource: string;
  timestamp: Date | string;
  ip?: string;
  details?: Record<string, any>;
}

export interface TeamSummary {
  id: string;
  name: string;
  teamId?: string;
  memberCount: number;
  averageEmotionalScore?: number;
  leaderId?: string;
  leaderName?: string;
  department?: string;
  activeUsers?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export interface GlobalOverviewTabProps {
  period?: string;
  segment?: string;
  filterBy?: string;
  className?: string;
}

export interface KpiCardProps {
  id?: string; // Made optional but present for backwards compatibility
  title: string;
  value: string | number;
  status?: KpiCardStatus;
  delta?: KpiDelta | {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  subtitle?: string;
  details?: string;
  trend?: string;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export type KpiCardStatus = 'positive' | 'negative' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'default';
export type KpiDelta = {
  value: number;
  direction: 'up' | 'down' | 'stable';
  label?: string; // Added for backward compatibility
  trend?: 'up' | 'down' | 'neutral'; // Added for backward compatibility
};

export interface DashboardWidgetConfig extends DashboardWidget {
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onReorder?: (newOrder: KpiCardProps[]) => void;
}
