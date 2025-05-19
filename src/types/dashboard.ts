
export interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  delta?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    direction?: 'up' | 'down' | 'stable'; // Adding direction property
    label?: string;
  };
  status?: KpiCardStatus;
  className?: string;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  ariaLabel?: string; // Adding ariaLabel property
}

export type KpiCardStatus = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

export type KpiDelta = {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  direction?: 'up' | 'down' | 'stable'; // Adding direction property
  label?: string;
};

export interface KpiCardsGridProps {
  cards: KpiCardProps[];
  className?: string;
}

export interface GlobalOverviewTabProps {
  className?: string;
  data?: any; // Adding data property
  isLoading?: boolean; // Adding isLoading property
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
  settings?: Record<string, any>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  kpi: string;
  width?: number;
  height?: number;
  settings?: Record<string, any>;
}

export interface TeamSummary {
  id: string;
  teamId?: string;
  name: string;
  memberCount: number; // Adding memberCount property
  activeUsers: number; // Adding activeUsers property
  averageScore: number; // Adding averageScore property
  trend: number;
  trendDirection: 'up' | 'down' | 'stable'; // Adding trendDirection property
  trendValue: number; // Adding trendValue property
  department: string; // Adding department property
  alertCount?: number;
  averageMood?: string | number;
}

export interface AdminAccessLog {
  id: string;  // Added id property
  adminId: string;
  action: string;
  timestamp: string;
  userName?: string; // Adding userName property
  resource?: string; // Adding resource property
  ip?: string; // Adding IP property
  adminName?: string; // Adding adminName property
}

export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onOrderChange?: (cards: KpiCardProps[]) => void;
  onLayoutChange?: (layout: any) => void;
  className?: string;
  isEditable?: boolean;
  onCardsReorder?: (cards: any[]) => void; // Adding onCardsReorder property
  onSave?: (layout: any) => void; // Adding onSave property
  savedLayout?: any; // Adding savedLayout property
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
