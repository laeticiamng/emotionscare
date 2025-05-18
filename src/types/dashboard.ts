
export type KpiCardStatus = 'success' | 'warning' | 'error' | 'info';

export interface KpiDelta {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  delta?: number | KpiDelta | { value: number; trend: string; label?: string };
  icon?: React.ReactNode;
  subtitle?: string;
  status?: KpiCardStatus;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onLayout?: (layout: any) => void;
  savedLayout?: any;
  isEditable?: boolean;
}

export interface GlobalOverviewTabProps {
  isLoading?: boolean;
  data?: any;
  filters?: any;
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  data: any;
  settings?: any;
}

export interface GamificationData {
  points: number;
  level: number;
  badges: number;
  streakDays: number;
  nextLevelPoints: number;
  achievements: any[];
}
