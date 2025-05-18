
export interface MusicTrack {
  id: string;
  title?: string;
  name?: string;
  artist?: string;
  duration?: number;
  url?: string;
  src?: string;
  audioUrl?: string;
  track_url?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  tags?: string[];
  genre?: string;
  album?: string;
  year?: number;
  created_at?: string;
  mood?: string;
  description?: string; // Added description field
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string; // Added coverImage field
  tags?: string[];
  mood?: string;
  created_at?: string;
  createdAt?: string; // Added for backward compatibility
  createdBy?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicPlaylist | null;
  emotion: string | null;
  openDrawer: boolean;
  isInitialized: boolean;
  isLoading?: boolean;
  error?: Error | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  toggleMute: () => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  setPlaylist?: (playlist: MusicPlaylist | MusicTrack[]) => void;
  getRecommendationByEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist>;
  generateMusic?: (prompt: string) => Promise<MusicTrack | null>;
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

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
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
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MusicPlayerProps {
  track: MusicTrack | null;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export interface MusicLibraryProps {
  tracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  onTrackSelect?: (track: MusicTrack) => void;
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  currentTrack?: MusicTrack | null;
  isLoading?: boolean;
}
