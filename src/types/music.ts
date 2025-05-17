
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  emotion?: string;
  genre?: string;
  album?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  emotion?: string;
  mood?: string;
  tracks: MusicTrack[];
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  isMuted?: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  currentEmotion?: string | null;
  emotion: string | null;
  recommendations?: MusicTrack[] | MusicPlaylist[];
  isLoading?: boolean;
  error?: Error | null;
  isInitialized?: boolean;
  openDrawer?: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem?: () => void;
}

export interface ProgressBarProps {
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
  formatTime?: (seconds: number) => string;
  showTimestamps?: boolean;
}
