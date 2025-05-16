
// Create or update the file for music-related types
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  category?: string;
  emotionalTone?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  title?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  play: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  nextTrack: () => void;
  previous: () => void;
  previousTrack: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
  muted: boolean;
  progress: number;
  duration: number;
  playlistId?: string;
  playlist?: MusicPlaylist;
  currentPlaylist?: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  setPlaylist: (playlist: MusicPlaylist) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  seekTo: (position: number) => void;
  currentTime?: number;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  currentEmotion?: string | null;
  setEmotion?: (emotion: string) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  currentTrack?: MusicTrack | null;
  playlist?: MusicPlaylist | null;
  children?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

// Music library props
export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void; 
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
}

// Add missing Track interface
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

// Add missing ProgressBarProps interface
export interface ProgressBarProps {
  progress: number;
  total: number;
  onSeek?: (position: number) => void;
  currentTime?: number;
  duration?: number;
  max?: number;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

// Add missing TrackInfoProps interface
export interface TrackInfoProps {
  track: MusicTrack | null;
  currentTime?: number;
  duration?: number;
}

// Add missing VolumeControlProps interface
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

// Add missing EmotionMusicParams interface
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

// Add missing MusicControlsProps interface
export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showVolume?: boolean;
  vertical?: boolean;
}
