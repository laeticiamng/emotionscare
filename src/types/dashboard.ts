
export interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  subtitle?: string;
  onClick?: () => void;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onLayoutChange?: (layout: any) => void;
  initialLayout?: any;
}

export interface GlobalOverviewTabProps {
  data?: any;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export interface GamificationData {
  totalPoints: number;
  level: number;
  badges: number;
  progress: number;
  nextLevel: number;
  streakDays: number;
  completedChallenges: number;
}
