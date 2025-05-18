
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
  adminId?: string; // Added missing property
  action: string;
  resource: string;
  timestamp: Date | string;
  ip?: string;
  details?: Record<string, any>;
}

export interface TeamSummary {
  id: string;
  name: string;
  teamId?: string; // Added missing property
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
  className?: string; // Added missing property
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  status?: KpiCardStatus;
  delta?: KpiDelta;
  icon?: React.ReactNode;
  details?: string;
  trend?: string;
  className?: string;
}

export type KpiCardStatus = 'positive' | 'negative' | 'neutral';
export type KpiDelta = {
  value: number;
  direction: 'up' | 'down' | 'stable';
};

export interface DashboardWidgetConfig extends DashboardWidget {
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onReorder?: (newOrder: KpiCardProps[]) => void;
}
