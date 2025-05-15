
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  category?: string;
  mood?: string[];
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  title?: string;
  description?: string;
  coverUrl?: string;
  category?: string;
  emotion?: string;
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

export interface TrackInfoProps {
  track: MusicTrack;
  onSelect?: (track: MusicTrack) => void;
  isActive?: boolean;
  className?: string;
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

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  currentTrack?: MusicTrack;
  playlist?: MusicPlaylist;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  className?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  currentPlaylist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  duration: number;
  currentTime: number;
  progress: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  openDrawer: boolean;
}
