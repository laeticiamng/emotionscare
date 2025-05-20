
// Music module type definitions

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  coverUrl?: string;
  duration: number;
  audioUrl?: string;
  emotion?: string;
  name?: string;
  mood?: string; // Added to fix errors
  category?: string | string[];
  tags?: string[];
  intensity?: number;
  album?: string;
  year?: number; // Added to fix errors
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
  tags?: string[]; // Added to fix errors
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
  muted?: boolean; // Added to fix errors
  toggleMute?: () => void; // Added to fix errors
  togglePlay?: () => void; // Added to fix errors
  previous?: () => void; // Added to fix errors
  next?: () => void; // Added to fix errors
  playlist?: MusicPlaylist | null; // Added to fix errors
  setOpenDrawer?: (isOpen: boolean) => void; // Added to fix errors
  isInitialized?: boolean; // Added to fix errors
  error?: string | null; // Added to fix errors
  setEmotion?: (emotion: string) => void; // Added to fix errors
  setCurrentTrack?: (track: MusicTrack) => void; // Added to fix errors
  openDrawer?: boolean; // Added to fix errors
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
