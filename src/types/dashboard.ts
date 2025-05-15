
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Period } from './gamification';

// Types for KPI cards
export interface KpiCardProps {
  title: string;
  value: string | number | React.ReactNode;
  change?: number | string;
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  status?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode | LucideIcon;
  color?: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  footer?: ReactNode;
  trend?: string;
  trendValue?: number;
  timeRange?: string;
  tooltip?: string;
  isLoading?: boolean;
  subtitle?: React.ReactNode;
  ariaLabel?: string;
}

// DraggableKpiCardsGridProps interface
export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  cards?: KpiCardProps[];
  onReorder?: (cards: KpiCardProps[]) => void;
  className?: string;
  allowReordering?: boolean;
}

// Interface for dashboard statistics
export interface DashboardStats {
  users: number;
  activeUsers: number;
  emotionalScore: number;
  sessionsCount: number;
  emotionalGrowth: number;
  newUsers: number;
  completedSessions: number;
  totalSessions: number;
  avgSessionTime: number;
  avgEmotionScore: number;
  emotionalBalance: number;
  wellbeingIndex: number;
}

// Interface for global overview tab
export interface GlobalOverviewTabProps {
  period?: Period;
  setPeriod?: (period: Period) => void;
  data?: DashboardStats;
  isLoading?: boolean;
  className?: string;
  kpiCards: KpiCardProps[];
  absenteeismChartData?: any;
  emotionalScoreTrend?: any;
  dashboardStats?: any;
  gamificationData?: GamificationData;
}

// Interface for chart data
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
    borderWidth?: number;
  }[];
}

// Interface for gamification data
export interface GamificationData {
  totalUsers: number;
  totalBadgesEarned: number;
  activeChallenges: number;
  leaderboardPosition?: number;
  completedChallenges: number;
  userEngagement: number;
  userGrowth: number;
  badgeDistribution: Record<string, number>;
  activeUsersPercent?: number;
  totalBadges?: number;
  recentBadges?: {
    id: string;
    name: string;
    user: string;
    date: string;
    icon?: string;
  }[];
}

// Dashboard widget configuration
export interface DashboardWidgetConfig {
  id: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
  type: 'chart' | 'stats' | 'table' | 'custom';
  component?: React.ReactNode;
  data?: any;
  settings?: Record<string, any>;
}

// Interface for grid position
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}
