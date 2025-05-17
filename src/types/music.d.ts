
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  imageUrl?: string;
  trackUrl?: string;
  audioUrl?: string;
  track_url?: string;
  genre?: string;
  year?: number;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  tracks: MusicTrack[];
  description?: string;
  imageUrl?: string;
  mood?: string;
  creator?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity: number;
  userId?: string;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  playlist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  isOpenDrawer?: boolean;
  playTrack: (track: MusicTrack) => void;
  playPlaylist: (playlist: MusicPlaylist) => void;
  playSimilar: (mood?: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  recommendByEmotion: (emotion: string, intensity?: number) => MusicPlaylist;
  getRecommendedPlaylists: (limit?: number) => MusicPlaylist[];
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  nextTrack?: () => void;
  previousTrack?: () => void;
  toggleMute?: () => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  currentPlaylist?: MusicPlaylist | null;
  emotion?: string | null;
  currentEmotion?: string | null;
  isMuted?: boolean;
  muted?: boolean;
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
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  small?: boolean;
}

export interface MusicLibraryProps {
  onPlaylistSelect: (playlist: MusicPlaylist) => void;
}
