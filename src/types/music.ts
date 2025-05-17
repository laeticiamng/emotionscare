
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  emotion?: string;
  genre?: string;
  bpm?: number;
  energy?: number;
  isActive?: boolean;
  isLiked?: boolean;
  createdAt?: string;
  category?: string;
  mood?: string;
  emotionalTone?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  coverUrl?: string;
  cover?: string;
  tracks: MusicTrack[];
  emotion?: string;
  isLiked?: boolean;
  mood?: string;
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
  muted: boolean;
  currentTime: number;
  duration: number;
  currentEmotion?: string | null;
  emotion?: string | null;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  error?: Error | null;
  isInitialized?: boolean;
  openDrawer?: boolean;
  
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
  initializeMusicSystem?: () => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
  children?: React.ReactNode;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  onSeek?: (value: number) => void;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onChange: (volume: number) => void;
  onMute: () => void;
  vertical?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
  track?: MusicTrack;
  showVolume?: boolean;
  size?: "sm" | "md" | "lg";
  vertical?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  tracks?: MusicTrack[];
  onPlayTrack?: (track: MusicTrack) => void;
  onPlayPlaylist?: (playlist: MusicPlaylist) => void;
  isLoading?: boolean;
  error?: Error;
}

export interface TrackInfoProps {
  track: MusicTrack;
  size?: "sm" | "md" | "lg";
  className?: string;
}
