
export interface KpiDelta {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  label?: string;
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number | KpiDelta;
  icon?: React.ReactNode;
  subtitle?: string;
  status?: KpiCardStatus;
  className?: string;
  isLoading?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  footer?: React.ReactNode;
}

export type KpiCardStatus = 'default' | 'success' | 'warning' | 'error' | 'info';
