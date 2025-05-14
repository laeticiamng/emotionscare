
import { ReactNode } from 'react';

export interface DashboardWidgetConfig {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  settings: Record<string, any>;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  userId?: string;
  period: 'day' | 'week' | 'month' | 'year';
  className?: string;
  onRefresh?: () => void;
}

export interface DashboardProps {
  userId: string;
  role: string;
  className?: string;
}

export interface WidgetProps {
  id: string;
  config: DashboardWidgetConfig;
  onEdit?: () => void;
  onRemove?: () => void;
  className?: string;
}

export interface ChartProps {
  data: any[];
  height?: number;
  width?: number;
  className?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (time: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track?: any;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: any;
  loadingTrack?: boolean;
  audioError?: string;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  children: ReactNode;
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: any;
  className?: string;
}
