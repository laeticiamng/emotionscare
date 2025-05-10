
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverUrl?: string;
  genre?: string;
  emotion?: string;
  audioUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  genre?: string;
}

export interface MusicRecommendationCardProps {
  title: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  onPlayTrack: (track: MusicTrack) => void;
  isLoading?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onProgressChange?: (progress: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  playlist?: MusicPlaylist | null;
  isLoading?: boolean;
  error?: Error | null;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  getTracksForEmotion: (emotion: string) => Promise<MusicTrack[]>;
  playTrack: (track: MusicTrack) => void;
  play: (track?: MusicTrack) => void;
  pauseTrack: () => void;
  pause: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadingTrack: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => void;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  currentEmotion?: string;
}
