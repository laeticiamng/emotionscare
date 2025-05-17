
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  coverImage?: string;
  emotionalTone?: string;
  genreId?: string;
  albumId?: string;
  playCount?: number;
  isFavorite?: boolean;
  bpm?: number;
  moodScore?: number;
  energyLevel?: number;
  visualizerType?: string;
  mood?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  description?: string;
  authorId?: string;
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublic?: boolean;
  mood?: string;
  emotion?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  isOpen?: boolean;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack | null;
  children?: React.ReactNode;
  side?: 'left' | 'right';
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (position: number) => void;
  position?: number;
  max?: number;
  onChange?: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  muted: boolean;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
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
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  className?: string;
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
  currentEmotion: string | null;
  emotion: string | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack?: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string | null) => void;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<boolean>;
  error?: Error | null;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  playlists?: MusicPlaylist[];
}
