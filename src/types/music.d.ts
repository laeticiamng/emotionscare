
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  url?: string;
  coverUrl?: string;
  category?: string;
  emotion?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  tracks: MusicTrack[];
  description?: string;
  emotion?: string;
  author?: string;
  category?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  isPlaying: boolean;
  volume: number;
  progress?: number;
  duration: number;
  muted: boolean;
  isRepeating?: boolean;
  isShuffling?: boolean;
  currentTime: number;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  setVolume: (value: number) => void;
  setProgress?: (value: number) => void;
  playTrack: (track: MusicTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack?: () => void;
  addTrack?: (track: MusicTrack) => void;
  setPlaylist?: (playlist: MusicPlaylist) => void;
  setCurrentTime?: (time: number) => void;
  setDuration?: (duration: number) => void;
  setIsPlaying?: (isPlaying: boolean) => void;
  setIsInitialized?: (isInitialized: boolean) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  pause?: () => void;
  resume?: () => void;
  seek?: (time: number) => void;
  seekTo?: (time: number) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  playEmotion?: (emotion: string) => void;
  setEmotion?: (emotion: string) => void;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  toggleDrawer?: () => void;
  error?: Error | null;
  isInitialized?: boolean;
  play?: (track?: MusicTrack, playlist?: MusicPlaylist) => void;
  playPlaylist?: (playlist: MusicPlaylist) => void;
  next?: () => void;
  previous?: () => void;
  generateMusic?: (params: any) => Promise<MusicTrack>;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface ProgressBarProps {
  value?: number;
  max?: number;
  onChange?: (value: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

export interface VolumeControlProps {
  volume?: number;
  isMuted?: boolean;
  onVolumeChange?: (value: number) => void;
  onMuteToggle?: () => void;
  className?: string;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  isRepeating?: boolean;
  isShuffling?: boolean;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRepeat?: () => void;
  onShuffle?: () => void;
}

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  onSelect: (track: MusicTrack) => void;
  currentTrackId?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export type MusicCategory = 'calm' | 'focus' | 'energy' | 'sleep' | 'joy' | 'sadness' | 'all';

export interface MusicPreference {
  id: string;
  userId: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  dislikedGenres?: string[];
  volume?: number;
  autoplay?: boolean;
}
