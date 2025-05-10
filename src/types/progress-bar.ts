
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSeek?: (time: number) => void;
  showTimestamps?: boolean;
  className?: string;
}
