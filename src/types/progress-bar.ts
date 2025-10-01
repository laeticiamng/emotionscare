// @ts-nocheck

export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  progress?: number;
  onSeek?: (percentage: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
  onChange?: (value: number) => void;
}
