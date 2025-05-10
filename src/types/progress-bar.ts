
export interface ProgressBarProps {
  value: number;
  max?: number;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}
