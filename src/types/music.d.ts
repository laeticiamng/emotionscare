
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  // Additional properties found in usage
  category?: string;
  mood?: string;
  cover?: string;
  url?: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  // Additional properties found in usage
  description?: string;
  category?: string;
  coverUrl?: string;
  title?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  // Add missing properties
  onSelectTrack?: (track: MusicTrack) => void;
  tracks?: MusicTrack[];
  loading?: boolean;
  error?: string | null;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  // Add missing properties
  onSeek?: (value: number) => void;
  className?: string;
  showTimestamps?: boolean;
  showLabel?: boolean;
  variant?: string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange?: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  // Add missing properties
  onChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
}

// Add MusicDrawerProps interface
export interface MusicDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
}
