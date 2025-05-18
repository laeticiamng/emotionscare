export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl: string;
  coverUrl?: string;
  cover?: string;
  emotion?: string;
  tags?: string[];
  genre?: string;
  year?: number;
  bpm?: number;
  favorited?: boolean;
  playCount?: number;
  explicit?: boolean;
  language?: string;
  mood?: string;
  intensity?: number;
  isLiveRecording?: boolean;
  isInstru?: boolean;
  name?: string; // Added for compatibility
  category?: string; // Added for filtering in MusicTabs
  src?: string; // Alternative URL field
  track_url?: string; // Legacy URL field
  coverImage?: string; // Alternative cover field
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // Added for compatibility
  description?: string;
  coverUrl?: string;
  cover?: string; // Added for compatibility
  coverImage?: string; // Alternative cover field
  tracks: MusicTrack[];
  emotion?: string;
  created_at?: string;
  modified_at?: string;
  creator?: string;
  isPublic?: boolean;
  tags?: string[];
  mood?: string;
  category?: string; // Added for compatibility
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

export interface MusicContextType {
  isInitialized: boolean;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  duration: number;
  currentTime: number;
  muted: boolean;
  playlist: MusicPlaylist | null;
  emotion: string | null;
  openDrawer: boolean;
  error?: Error | null;
  
  // Methods
  setVolume: (volume: number) => void;
  setMute: (muted: boolean) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  togglePlayPause: () => void;
  togglePlay: () => void;  // Added for compatibility
  toggleDrawer: () => void;
  closeDrawer: () => void;
  setOpenDrawer: (open: boolean) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void; // Alias for prevTrack
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setPlaylist: (playlist: MusicPlaylist | MusicTrack[]) => void;
  generateMusic: (prompt: string) => Promise<MusicTrack>;
  
  // Added for compatibility with other code
  getRecommendationByEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | MusicTrack[]>;
  setCurrentTrack?: (track: MusicTrack) => void;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  allTracks?: MusicTrack[];
  playlists?: MusicPlaylist[];
  isMuted?: boolean;
}

export interface MusicPlayerProps {
  track?: MusicTrack | null;
  autoPlay?: boolean;
  showControls?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  // Additional props needed by components
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  progress?: number;
  minimal?: boolean;
}

export interface MusicDrawerProps {
  open: boolean;
  isOpen?: boolean;
  onClose: () => void;
  currentTrack?: MusicTrack | null;
  recommendations?: MusicTrack[];
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  children?: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  tracks?: MusicTrack[];
  onPlaylistSelect?: (playlist: MusicPlaylist) => void;
  onTrackSelect?: (track: MusicTrack) => void;
  onSelectPlaylist?: (playlist: MusicPlaylist) => void; // Alias for onPlaylistSelect
  onSelectTrack?: (track: MusicTrack) => void; // Alias for onTrackSelect
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  track?: MusicTrack | null;
  volume?: number;
  onVolumeChange?: (value: number) => void;
  progress?: number;
  onSeek?: (value: number) => void;
  duration?: number;
  currentTime?: number;
  minimal?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  filters?: {
    tempo?: 'slow' | 'medium' | 'fast';
    genre?: string;
    instrumental?: boolean;
  };
}

export interface DataPrivacyProps {
  control: any;
  isLoading?: boolean;
}
