
export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek?: (value: number) => void;
  showTimestamps?: boolean;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
}
