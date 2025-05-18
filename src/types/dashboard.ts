
export interface KpiDelta {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface KpiCardProps {
  id?: string; // Make id optional to maintain compatibility
  title: string;
  value: string | number;
  delta?: number | KpiDelta;
  icon?: React.ReactNode;
  subtitle?: string | React.ReactNode;
  status?: KpiCardStatus;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export type KpiCardStatus = 'default' | 'success' | 'warning' | 'error' | 'info';

// Adding missing DashboardWidgetConfig interface
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

// Adding missing DraggableKpiCardsGridProps interface
export interface DraggableKpiCardsGridProps {
  cards?: KpiCardProps[];
  onCardsReorder?: (cards: KpiCardProps[]) => void;
  onOrderChange?: (cards: KpiCardProps[]) => void;
  onSave?: (layouts: any) => void;
  savedLayout?: any;
  className?: string;
  isEditable?: boolean;
}
