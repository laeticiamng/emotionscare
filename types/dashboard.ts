import { ReactNode } from 'react';

export type KpiCardStatus = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface KpiDelta {
  value?: number;
  trend?: 'up' | 'down' | 'neutral';
  direction?: 'up' | 'down' | 'stable';
  label?: string;
}

export interface KpiCardProps {
  id?: string;
  title: string;
  value: ReactNode;
  delta?: KpiDelta | number;
  icon?: ReactNode;
  subtitle?: ReactNode;
  status?: KpiCardStatus;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: ReactNode;
}

export interface KpiCardsGridProps {
  cards: KpiCardProps[];
  className?: string;
}

export interface GlobalOverviewTabProps {
  className?: string;
  data?: any;
  isLoading?: boolean;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  settings?: Record<string, any>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  kpi: string;
  width?: number;
  height?: number;
  settings?: Record<string, any>;
}

export interface TeamSummary {
  id: string;
  teamId?: string;
  name: string;
  memberCount: number;
  activeUsers: number;
  averageScore: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendValue: number;
  department: string;
  alertCount?: number;
  averageMood?: string | number;
}

export interface AdminAccessLog {
  id: string;
  adminId: string;
  action: string;
  timestamp: string;
  userName?: string;
  resource?: string;
  ip?: string;
  adminName?: string;
  userId?: string;
  details?: string;
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
  onLayoutChange?: (layout: any) => void;
  className?: string;
  isEditable?: boolean;
  onCardsReorder?: (cards: any[]) => void;
  onSave?: (layout: any) => void;
  savedLayout?: any;
}

export interface GamificationData {
  points: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  challenges: Challenge[];
  nextLevel: number;
  pointsToNextLevel: number;
}

interface Badge {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

interface Challenge {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
}
