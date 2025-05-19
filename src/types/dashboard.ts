
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
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface KpiCardsGridProps {
  cards: KpiCardProps[];
}

export interface DraggableKpiCardsGridProps {
  cards: KpiCardProps[];
  kpiCards?: KpiCardProps[];
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  onOrderChange?: (newOrder: KpiCardProps[]) => void;
  onSave?: (layouts: any) => void;
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
  data?: any;
  isLoading?: boolean;
}

export interface TeamSummary {
  id: string;
  name: string;
  teamId?: string; // For backward compatibility
  memberCount?: number;
  count?: number; // For backward compatibility
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
  userId?: string; // For backward compatibility
  userName?: string; // For backward compatibility
  resource?: string; // For backward compatibility
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  settings?: Record<string, any>;
}
