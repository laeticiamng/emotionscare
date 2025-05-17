
export interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onOrderChange?: (newOrder: KpiCardProps[]) => void;
}

export interface GlobalOverviewTabProps {
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

export interface LeaderboardEntry {
  id: string;
  userId: string;
  points: number;
  rank: number;
  avatar?: string;
  name?: string;
}
