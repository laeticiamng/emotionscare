
export interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  delta?: number | KpiDelta | { 
    value: number; 
    trend: "up" | "down" | "neutral"; 
    label?: string; 
    direction?: "up" | "down" | "stable"; 
  };
  status?: KpiCardStatus;
  icon?: React.ReactNode;
  subtitle?: string;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  footer?: React.ReactNode;
  ariaLabel?: string;
}

export type KpiCardStatus = 'success' | 'warning' | 'error' | 'neutral' | 'info';

export interface KpiDelta {
  value: number;
  trend: "up" | "down" | "neutral";
  label?: string;
  direction?: "up" | "down" | "stable";
}

export interface KpiCardsGridProps {
  cards?: KpiCardProps[];
  className?: string;
  draggable?: boolean;
}

export interface DraggableKpiCardsGridProps extends KpiCardsGridProps {
  onReorder?: (newCards: KpiCardProps[]) => void;
}

export interface GlobalOverviewTabProps {
  data?: any;
  isLoading?: boolean;
}

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: { x: number; y: number; w: number; h: number };
  data?: any;
  settings?: any;
}

export interface TeamSummary {
  id: string;
  name: string;
  count: number;
  emotionAverage: string;
  trend: "up" | "down" | "neutral";
  lastUpdated: Date | string;
}

export interface AdminAccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date | string;
  ip?: string;
  userAgent?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'list' | 'custom';
  title: string;
  data?: any;
  config?: any;
  position?: { x: number; y: number; w: number; h: number };
}

export interface GamificationData {
  badges: number;
  points: number;
  streak: number;
  level: number;
  progress: number;
  nextLevel: number;
  nextLevelPoints: number;
  rank?: string;
  position?: number;
  total?: number;
}
