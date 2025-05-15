
import { ReactNode } from 'react';
import { Period } from './gamification';

// Types for KPI cards
export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number | string;
  status?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
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
}

// DraggableKpiCardsGridProps interface
export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
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
  period: Period;
  setPeriod: (period: Period) => void;
  data: DashboardStats;
  isLoading?: boolean;
  className?: string;
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
  recentBadges: {
    id: string;
    name: string;
    user: string;
    date: string;
    icon?: string;
  }[];
}

// Interface for grid position
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}
