
// Types liés au dashboard
export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  width?: number;
  height?: number;
  position?: { x: number; y: number };
  dataSource?: string;
  refreshInterval?: number;
  settings?: Record<string, any>;
}

export interface DashboardKpi {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
  format?: string;
}

export interface DashboardShortcut {
  id: string;
  title: string;
  icon: string;
  url: string;
  color?: string;
  badge?: number;
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
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalVRSessions: number;
  avgEmotionalScore: number;
  totalScans: number;
  alerts: number;
  completion: number;
}

export interface GamificationData {
  activeUsersPercent: number;
  totalBadges: number;
  badgeLevels: {
    level: string;
    count: number;
    color: string;
  }[];
  topChallenges: {
    name: string;
    completion: number;
  }[];
}

// Position dans la grille pour les composants draggable
export interface GridPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

// Props pour les cartes KPI utilisées dans le tableau de bord admin
export interface KpiCardProps {
  id: string;
  title: string;
  value: string | React.ReactNode;
  icon: any; // LucideIcon
  delta?: {
    value: number;
    label?: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;
}

export interface GlobalOverviewTabProps {
  kpiCards: KpiCardProps[];
}

export interface DraggableKpiCardsGridProps {
  kpiCards: KpiCardProps[];
}
