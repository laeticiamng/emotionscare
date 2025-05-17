
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  album?: string;
  genre?: string;
  emotion?: string;
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  emotion?: string;
  mood?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted?: boolean;
  currentTime: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack?: () => void;
  previousTrack?: () => void;
  setVolume: (volume: number) => void;
  toggleMute?: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  recommendByEmotion?: (emotion: string, intensity?: number) => MusicPlaylist;
  playlists?: MusicPlaylist[];
  openDrawer?: boolean;
  emotion?: string | null;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
  recommendations?: MusicTrack[];
  isLoading?: boolean;
  error?: Error | null;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
}

export interface MusicDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onMuteToggle?: () => void;
  isMuted?: boolean;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  onSelect?: (playlist: MusicPlaylist) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}
