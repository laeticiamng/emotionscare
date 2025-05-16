
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
