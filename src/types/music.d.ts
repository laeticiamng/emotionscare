
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (level: number) => void;
  playlist: MusicPlaylist | null;
  setPlaylist: (playlist: MusicPlaylist) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  duration: number;
  currentTime: number;
  progress: number;
  seek: (time: number) => void;
  seekTo: (time: number) => void;
  setOpenDrawer?: (open: boolean) => void;
  isOpenDrawer?: boolean;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  currentEmotion?: string;
  muted: boolean;
  toggleMute: () => void;
  playlists?: MusicPlaylist[];
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  cover_url?: string;  // Legacy support
  coverImage?: string; // Additional support
  duration: number;
  source: string;
  album?: string;
  url?: string;
  track_url?: string;  // Legacy support
  audioUrl?: string;   // Legacy support
  mood?: string;
  genre?: string;
  bpm?: number;
  emotion?: string; 
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime: number;
  duration: number;
  onSeek?: (position: number) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicLibraryProps {
  onTrackSelect?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  tracks?: MusicTrack[];
}

export interface MusicDrawerProps {
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  open?: boolean;
  onClose?: () => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}
