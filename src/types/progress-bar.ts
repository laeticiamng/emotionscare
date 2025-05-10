
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  isCompact?: boolean;
  color?: string;
}
