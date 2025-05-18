
import { Badge, Challenge, LeaderboardEntry } from './badge';

export interface KpiCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  percentage?: number;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
}

export interface KpiCardData {
  id: string;
  title: string;
  value: number;
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

export type { LeaderboardEntry };
