
export interface MusicTrack {
  id: string;
  name?: string;
  title?: string;
  artist?: string;
  duration?: number;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  cover_url?: string;
  audioUrl?: string; 
  src?: string; // For compatibility with existing code
  url?: string; // For compatibility with existing code
  track_url?: string;
  genre?: string;
  mood?: string;
  emotion?: string;
  intensity?: number;
  bpm?: number;
  tags?: string[];
  created_at?: string;
  user_id?: string;
  album?: string;
  year?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  mood?: string;
  emotion?: string;
  tags?: string[];
  created_at?: string;
  createdAt?: string;
  createdBy?: string;
  isPublic?: boolean;
  user_id?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  isInitialized: boolean;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  duration: number;
  playlist: MusicPlaylist | null;
  currentTime: number;
  muted: boolean;
  emotion: string | null;
  openDrawer: boolean;
  isLoading?: boolean;
  error?: Error | null;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  setCurrentTrack: (track: MusicTrack) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  getRecommendationByEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist>;
  setOpenDrawer: (open: boolean) => void;
  generateMusic?: (prompt: string) => Promise<MusicTrack | null>;
  // Adding missing methods that appear in the error messages
  playTrack?: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  setEmotion?: (emotion: string) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist | null;
  currentTrack?: MusicTrack | null;
  side?: "left" | "right" | "top" | "bottom";
  children?: React.ReactNode;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  progress?: number; // Added for compatibility
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  minimal?: boolean;
  track?: MusicTrack | null;
  progress?: number;
  duration?: number;
  currentTime?: number;
  volume?: number;
  onPause?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (time: number) => void;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
}

export interface MusicPlayerProps {
  track?: MusicTrack;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  progress?: number;
  duration?: number;
  currentTime?: number;
  onSeek?: (time: number) => void;
}

export interface MusicMoodVisualizationProps {
  mood?: string;
  intensity?: number;
}
