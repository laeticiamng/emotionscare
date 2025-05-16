
// Types for music functionality
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  cover_url?: string;
  audioUrl?: string;
  url?: string;
  track_url?: string;
  duration?: number;
  category?: string;
  mood?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  muted?: boolean;
  currentTime: number;
  duration: number;
  progress?: number;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  error?: Error | null;
  isInitialized?: boolean;
  openDrawer?: boolean;
  emotion?: string | null;
  initializeMusicSystem?: () => Promise<void>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo?: (position: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
}

export interface MusicLibraryProps {
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onPrevious?: () => void;
  onNext: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (value: number) => void;
  track?: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  showLabel?: boolean;
  onChange?: (volume: number) => void;
  className?: string;
}

export interface ProgressBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
  currentTime?: number;
  max?: number;
  onChange?: (value: number) => void;
  formatTime?: (seconds: number) => string;
  className?: string;
  showTimestamps?: boolean;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}
