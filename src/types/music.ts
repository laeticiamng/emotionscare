
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  audio_url?: string; // Added for compatibility
  emotion?: string;
  genre?: string;
  album?: string;
  year?: number;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  duration?: number;
  trackCount?: number;
  createdBy?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  repeatMode: 'none' | 'one' | 'all';
  toggleRepeatMode: () => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  className?: string;
  compact?: boolean;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  showLabel?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  formatTime?: (seconds: number) => string;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  showTimestamps?: boolean;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  progress?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}
