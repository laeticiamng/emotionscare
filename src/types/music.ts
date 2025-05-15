
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string; // Add this for compatibility
  audioUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // For compatibility
  emotion?: string;
  tracks: MusicTrack[];
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
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  play?: (track: MusicTrack) => void; // Back-compat
  pause?: () => void; // Back-compat
  resumeTrack?: () => void; // Back-compat
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  currentEmotion: string;
  setEmotion: (emotion: string) => void;
  toggleMute: () => void;
  adjustVolume: (value: number) => void;
  setVolume: (value: number) => void;
  loadPlaylistById: (id: string) => void;
  isInitialized: boolean;
  initializeMusicSystem: () => void;
  error?: string | null;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  currentTrackDuration?: number;
  currentTime?: number;
  loading?: boolean;
}

export interface TrackInfoProps {
  track?: MusicTrack;
  title?: string;
  artist?: string;
  coverUrl?: string;
  showCover?: boolean;
  showControls?: boolean;
  currentTrack?: MusicTrack;
  loadingTrack?: boolean;
  audioError?: Error | null;
  className?: string;
  compact?: boolean;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime: number;
  duration: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[] | number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  goal?: 'relax' | 'focus' | 'energize' | 'sleep';
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  tracks?: MusicTrack[];
  onPlayTrack?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  loading?: boolean;
  error?: string | null;
}
