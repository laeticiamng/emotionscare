
export interface TeamSummary {
  id: string;
  name: string;
  memberCount: number;
  activeUsers: number;
  averageScore?: number;
  emotionalAverage?: number;
  count?: number;
  trend?: number;
}

export interface AdminAccessLog {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  userName?: string;
  resource?: string;
  details?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
}
