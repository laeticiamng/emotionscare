
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl: string;
  coverUrl?: string;
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
  isLiveRecording?: boolean;
  isInstru?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  created_at?: string;
  modified_at?: string;
  creator?: string;
  isPublic?: boolean;
  tags?: string[];
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
  
  // Methods
  setVolume: (volume: number) => void;
  setMute: (muted: boolean) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  togglePlayPause: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  setPlaylist: (playlist: MusicPlaylist | MusicTrack[]) => void;
  generateMusic: (prompt: string) => Promise<MusicTrack>;
}

export interface MusicPlayerProps {
  track?: MusicTrack | null;
  autoPlay?: boolean;
  showControls?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  currentTrack: MusicTrack | null;
  recommendations?: MusicTrack[];
}
