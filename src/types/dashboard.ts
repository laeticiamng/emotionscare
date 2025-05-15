
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface KpiCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: LucideIcon;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  } | number;
  subtitle?: ReactNode;
  ariaLabel?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  trend?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  className?: string;
  onLayoutChange?: (layout: any) => void;
  initialLayout?: any;
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
  absenteeismChartData?: any;
  emotionalScoreTrend?: any;
  dashboardStats?: any;
  gamificationData?: any;
  isLoading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<any>;
  defaultPosition?: GridPosition;
  defaultSize?: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  settings?: Record<string, any>;
}

export interface DashboardStats {
  userCount: number;
  activeUsers: number;
  avgEngagement: number;
  totalSessions: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface GamificationData {
  totalPoints: number;
  recentBadges: any[];
  challengesCompleted: number;
  rank: string;
  level: number;
  nextLevelProgress: number;
}
