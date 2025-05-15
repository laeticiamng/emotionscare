
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl?: string;
  url?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  category?: string;
  mood?: string[];
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  tracks: MusicTrack[];
  description?: string;
  category?: string;
  coverUrl?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
  children?: React.ReactNode;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  cover?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  showLabel?: boolean;
  className?: string;
  variant?: string;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (event: React.MouseEvent) => void;
  showTimestamps?: boolean;
  onSeek?: (value: number) => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
  onClick?: () => void;
  isActive?: boolean;
  showArtist?: boolean;
  showDuration?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  onChange?: (volume: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
  isLoading?: boolean;
}
