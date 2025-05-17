
export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName?: string;
  name?: string;
  avatar?: string;
  score: number;
  rank: number;
  team?: string;
  department?: string;
  level?: number;
  badges?: number | string[];
  position?: number;
  points?: number;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  trendText?: string;
  icon?: React.ReactNode;
  colorScheme?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  onClick?: () => void;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
}

export interface GlobalOverviewTabProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  col: number;
  row: number;
  width: number;
  height: number;
  visible: boolean;
  data?: any;
}

export interface GamificationData {
  points: number;
  level: number;
  badges: number;
  rank: number;
  completedChallenges: number;
  nextMilestone: number;
  progress: number;
}
