
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion?: string;
  tracks: MusicTrack[];
  title?: string;
  description?: string;
  category?: string;
  coverUrl?: string;
  imageUrl?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  queue: MusicTrack[];
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentPlaylist: (playlist: MusicPlaylist) => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  progress?: number;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  category?: string;
}

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
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showArtist?: boolean;
  showCover?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  onChange?: (volume: number) => void;
  className?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicLibraryProps {
  title?: string;
  filter?: string;
  onFilterChange?: (filter: string) => void;
  onTrackSelect?: (track: MusicTrack) => void;
  playlists?: MusicPlaylist[];
}
