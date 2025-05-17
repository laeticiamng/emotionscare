
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  duration?: number;
  emotion?: string;
  genre?: string;
  intensity?: number;
  year?: number;
  bpm?: number;
  instrumentalness?: number;
  valence?: number;
  energy?: number;
  audioUrl?: string;
  track_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  cover?: string;
  coverUrl?: string;
  emotion?: string;
  createdAt?: string;
  duration?: number;
  author?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted?: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicPlaylist | null;
  currentPlaylist?: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  openDrawer?: boolean;
  currentEmotion?: string | null;
  emotion?: string | null;
  isShuffled?: boolean;
  isRepeating?: boolean;
  queue?: MusicTrack[];
  error?: Error | null;
  isInitialized?: boolean;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  
  // Methods
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  playNext?: () => void;
  playPrevious?: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  shufflePlaylist?: () => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  playSimilar?: (mood?: string) => void;
  
  recommendByEmotion?: (emotion: string, intensity?: number) => MusicPlaylist;
  getRecommendedPlaylists?: (limit?: number) => MusicPlaylist[];
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  position?: number;
  max?: number;
  onChange?: (value: number) => void;
  showTimestamps?: boolean;
  formatTime?: (seconds: number) => string;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  muted?: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute?: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  shuffleMode?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack | null;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export interface MusicLibraryProps {
  onSelect?: (track: MusicTrack) => void;
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  currentPlaylistId?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  energy?: number;
  limit?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}
