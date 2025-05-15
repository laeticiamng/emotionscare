
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  genre?: string;
  source?: string;
  audioUrl?: string;
  description?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  tracks: MusicTrack[];
  category?: string;
  mood?: string;
  duration?: number;
  trackCount?: number;
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  setCurrentTrack: (track: MusicTrack) => void;
  setCurrentPlaylist: (playlist: MusicPlaylist) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
  children?: React.ReactNode;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  showLabel?: boolean;
  variant?: string;
  progress?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
  onSelect?: (track: MusicTrack) => void;
  isActive?: boolean;
  isCompact?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  onChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicLibraryProps {
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  playlists?: MusicPlaylist[];
  tracks?: MusicTrack[];
  className?: string;
  activeTrack?: MusicTrack | null;
  showCategories?: boolean;
  showGenres?: boolean;
  filter?: string;
}
