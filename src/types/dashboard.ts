
// Types pour les composants du tableau de bord
import { LucideIcon } from "lucide-react";

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface KpiCardProps {
  title: string;
  value: string | number | React.ReactNode;
  delta?: number;
  position?: GridPosition;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  className?: string;
  onPositionChange?: (newPositions: Record<string, GridPosition>) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  position?: GridPosition;
  settings?: Record<string, any>;
  data?: any;
}

export interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  averageScore?: number;
  highRiskUsers?: number;
  totalSessions?: number;
  completedSessions?: number;
  vrSessionsCount?: number;
  scanCount?: number;
  recentActivity?: number;
  emotionalBalance?: number;
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: Array<{ level: string; count: number }>;
  topChallenges: Array<{ name: string; completions: number }>;
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
  absenteeismChartData?: Array<{ date: string; value: number }>;
  emotionalScoreTrend?: Array<{ date: string; value: number }>;
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationData;
  isLoading?: boolean;
}
