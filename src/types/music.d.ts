
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
  category?: string; // Added to support mock data
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  emotion?: string;
  coverUrl?: string; // Added for mock data
  description?: string; // Added for MusicTabs
  category?: string; // Added for MusicLibrary
  title?: string; // For compatibility
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
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (value: number) => void;
  onChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
  onSelect?: () => void;
  isActive?: boolean;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<void>;
}

// Additional interface for LibraryTab
export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
}
