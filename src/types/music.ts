
// Music module type definitions

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  coverImage?: string;
  artworkUrl?: string;
  duration: number;
  audioUrl?: string;
  audio_url?: string;
  src?: string;
  track_url?: string;
  emotion?: string;
  name?: string;
  mood?: string;
  category?: string | string[];
  tags?: string[];
  intensity?: number;
  album?: string;
  year?: number;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  tracks: MusicTrack[];
  emotion?: string;
  mood?: string;
  description?: string;
  coverUrl?: string;
  category?: string | string[];
  coverImage?: string;
  creator?: string;
  tags?: string[];
  cover?: string;
}

export interface MusicCategory {
  id: string;
  name: string;
  playlists: MusicPlaylist[];
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  context?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  categories?: MusicCategory[];
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack?: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  playPlaylist: (playlist: MusicPlaylist) => void;
  shuffle: () => void;
  repeat: () => void;
  isLoading?: boolean;
  getCurrentTrack?: () => MusicTrack | null;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  playEmotion?: (emotion: string) => void;
  addToPlaylist?: (trackId: string, playlistId: string) => void;
  removeFromPlaylist?: (trackId: string, playlistId: string) => void;
  createPlaylist?: (name: string, tracks?: MusicTrack[]) => void;
  generateMusic?: (prompt: string) => Promise<{ tracks: MusicTrack[] }>;
  pause?: () => void;
  resume?: () => void;
  muted?: boolean;
  toggleMute?: () => void;
  togglePlay?: () => void;
  previous?: () => void;
  next?: () => void;
  playlist?: MusicPlaylist | null;
  setOpenDrawer?: (isOpen: boolean) => void;
  isInitialized?: boolean;
  error?: string | null;
  setEmotion?: (emotion: string) => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  openDrawer?: boolean;
}

export interface MusicDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  showSkipControls?: boolean;
  compact?: boolean;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onPlaylistSelect: (playlist: MusicPlaylist) => void;
  currentPlaylist?: MusicPlaylist | null;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  compact?: boolean;
}

export interface MusicSession {
  id: string;
  userId: string;
  playlistId?: string;
  trackIds: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
  notes?: string;
}
