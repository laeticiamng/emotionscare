
export interface TeamSummary {
  teamId: string;
  memberCount: number;
  averageMood: string | number;
  alertCount: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface AdminAccessLog {
  adminId: string;
  action: string;
  timestamp: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  kpi: string;
  width?: number;
  height?: number;
  settings?: Record<string, any>;
}

export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    label?: string;
  };
  className?: string;
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
  className?: string;
  isEditable?: boolean;
}

export interface GlobalOverviewTabProps {
  className?: string;
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
  settings?: Record<string, any>;
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
