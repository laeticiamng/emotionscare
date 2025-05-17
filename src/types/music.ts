
// Types for music features

export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  audioUrl?: string;
  url?: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  mood?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  mood?: string;
  emotion?: string;
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted?: boolean;
  isMuted?: boolean;
  duration: number;
  currentTime: number;
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  openDrawer?: boolean;
  currentEmotion?: string | null;
  emotion?: string | null;
  isShuffled?: boolean;
  isRepeating?: boolean;
  queue?: MusicTrack[];
  error?: Error | null;
  isInitialized?: boolean;
  recommendations?: MusicPlaylist[] | null;
  isLoading?: boolean;
  
  // Methods
  playTrack: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute?: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null> | void;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  shufflePlaylist?: () => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  playSimilar?: (mood?: string) => void;
  
  recommendByEmotion?: (emotion: string, intensity?: number) => MusicPlaylist;
  getRecommendedPlaylists?: (limit?: number) => MusicPlaylist[];
  initializeMusicSystem?: () => void;
}

export interface MusicDrawerProps {
  open?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
}

export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
  className?: string;
  position?: number;
  max?: number;
  onChange?: (value: number) => void;
  value?: number;
}

export interface VolumeControlProps {
  volume: number;
  muted?: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute?: () => void;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  shuffleMode?: boolean;
  repeatMode?: boolean;
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
  progress?: number;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  currentPlaylistId?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
}
