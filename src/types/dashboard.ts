
import { ReactNode } from "react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  unit?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
  onClick?: () => void;
  period?: string;
  delta?: number | {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string | ReactNode;
  ariaLabel?: string;
  className?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
  trendText?: string;
  loading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: "kpi" | "chart" | "table" | "list" | "calendar" | "custom";
  size: "small" | "medium" | "large" | "full";
  visible: boolean;
  priority: number;
  data?: any;
  icon?: string;
  description?: string;
  component?: ReactNode;
  settings?: {
    title?: string;
    value?: string | number;
    trend?: string;
    [key: string]: any;
  };
}

export interface DraggableKpiCardsGridProps {
  widgets: DashboardWidgetConfig[];
  onWidgetsChange?: (widgets: DashboardWidgetConfig[]) => void;
  isEditing?: boolean;
}

export interface GlobalOverviewTabProps {
  period?: "day" | "week" | "month" | "year";
  userId?: string;
}

export interface GamificationData {
  points: number;
  level: number;
  badge?: string;
  streakDays: number;
  lastActivity?: Date;
  progress: number;
  nextLevel: number;
  nextLevelPoints: number;
}

export interface EmotionalTeamViewProps {
  departmentId?: string;
  period?: "day" | "week" | "month" | "year";
}
