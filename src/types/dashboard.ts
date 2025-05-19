
export type KpiCardStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface KpiDelta {
  value?: number;
  label?: string;
  trend?: 'up' | 'down' | 'neutral';
  direction?: 'up' | 'down' | 'stable'; // For backward compatibility
}

export interface KpiCardProps {
  id?: string;
  title: string;
  value: React.ReactNode;
  delta?: KpiDelta | number;
  status?: KpiCardStatus;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
  footer?: React.ReactNode;
  ariaLabel?: string;
}

export interface KpiCardsGridProps {
  cards: KpiCardProps[];
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  onOrderChange?: (newOrder: string[]) => void;
  onSave?: () => void;
  savedLayout?: { [id: string]: any };
  className?: string;
  isEditable?: boolean;
}

export type GamificationData = {
  level: number;
  points: number;
  badges: number;
  challenges: number;
};

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  type: string;
  data?: any;
  settings?: any;
}

export interface GlobalOverviewTabProps {
  className?: string;
}

export interface TeamSummary {
  id: string;
  name: string;
  teamId?: string; // For backward compatibility
  memberCount?: number;
  activeUsers?: number;
  emotionalScore?: number;
  averageEmotionalScore?: number;
  trendDirection?: 'up' | 'down' | 'stable';
  trendValue?: number;
  department?: string;
}

export interface AdminAccessLog {
  id: string;
  adminName: string;
  adminId?: string; // For backward compatibility
  action: string;
  details: string;
  timestamp: string | Date;
  ip?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  settings?: Record<string, any>;
}
