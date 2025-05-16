
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  track_url?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  emotionalTone?: string;
  mood?: string;
  tags?: string[];
  isFavorited?: boolean;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  category?: string;
  mood?: string;
  tracks?: MusicTrack[];
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume?: number;
  onChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  onToggleFavorite?: (trackId: string) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  tags?: string[];
}
