
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
  action: string;
  resource: string;
  timestamp: Date;
  ip?: string;
  details?: Record<string, any>;
}

export interface TeamSummary {
  id: string;
  name: string;
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
}
