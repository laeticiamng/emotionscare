
import { LucideIcon } from "lucide-react";
import React from "react";

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  position: GridPosition;
  size?: { w: number; h: number };
  dataSource?: string;
  settings?: any;
}

export interface KpiCardProps {
  title: string;
  value: string | number | React.ReactNode;
  delta?: number;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  position?: GridPosition;
  className?: string;
  ariaLabel?: string;
  isLoading?: boolean;
  subtitle?: React.ReactNode;
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  className?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface DashboardStats {
  users: number;
  activeUsers: number;
  emotions: number;
  emotionAverage: number;
  sessionsCompleted: number;
  alerts: number;
  activeUsersPercent?: number;
  totalUsers?: number;
  activeToday?: number;
  averageScore?: number;
  criticalAlerts?: number;
  completion?: number;
  productivity?: {
    current: number;
    trend: number;
  };
  emotionalScore?: {
    current: number;
    trend: number;
  };
}

export interface GamificationData {
  totalUsers: number;
  badgesAwarded: number;
  completionRate: number;
  topChallenges: { name: string; count: number; completions?: number }[];
  activeUsersPercent?: number; 
  totalBadges?: number;
  badgeLevels?: { level: string; count: number }[];
}

export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
  absenteeismChartData?: ChartData;
  emotionalScoreTrend?: ChartData;
  dashboardStats?: DashboardStats;
  gamificationData?: GamificationData;
  isLoading?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: string;
  showFilters?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  change?: number;
  avatar?: string;
}
