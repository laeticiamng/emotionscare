
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  playlist: MusicTrack[];
  duration: number;
  currentTime: number;
  progress?: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (level: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack?: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  currentEmotion?: string;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  playlists?: MusicPlaylist[];
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<boolean>;
  error?: Error | null;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string; // Additional support
  cover_url?: string;  // Legacy support
  duration?: number;
  url: string;
  audioUrl?: string;   // Legacy support
  track_url?: string;  // Legacy support
  mood?: string;
  genre?: string;
  bpm?: number;
  emotion?: string; 
  intensity?: number;
  emotionalTone?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  mood?: string;
  description?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface ProgressBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
  currentTime?: number; 
  formatTime?: (seconds: number) => string;
  className?: string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange?: (volume: number) => void;
  onVolumeChange: (volume: number) => void;
  isMuted?: boolean;
  muted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
  showLabel?: boolean;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (position: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  onSelectTrack?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
  onTrackSelect?: (track: MusicTrack) => void;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
  showCover?: boolean;
}
