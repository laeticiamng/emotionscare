
export interface DashboardWidgetConfig {
  id: string;
  type: string;
  title: string;
  description?: string;
  position: GridPosition;
  size?: { w: number; h: number };
  dataSource?: string;
  settings?: any; // Required by the Admin dashboard kpi cards
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
}

export interface GamificationData {
  totalUsers: number;
  badgesAwarded: number;
  completionRate: number;
  topChallenges: { name: string; count: number }[];
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
