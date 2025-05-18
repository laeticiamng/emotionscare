export interface TeamSummary {
  teamId: string;
  memberCount: number;
  averageMood: string | number;
  alertCount: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface AdminAccessLog {
  adminId: string;
  action: string;
  timestamp: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  kpi: string;
  width?: number;
  height?: number;
  settings?: Record<string, any>;
}
