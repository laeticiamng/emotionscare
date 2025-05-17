
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  audioUrl?: string;
  url?: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  mood?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  mood?: string;
  emotion?: string;
  description?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted?: boolean;
  isMuted?: boolean;
  duration: number;
  currentTime: number;
  playlist: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  openDrawer?: boolean;
  currentEmotion?: string | null;
  emotion?: string | null;
  isShuffled?: boolean;
  isRepeating?: boolean;
  queue?: MusicTrack[];
  error?: Error | null;
  isInitialized?: boolean;
  
  // Méthodes
  playTrack: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack?: () => void;
  previousTrack?: () => void;
  playNext?: () => void;
  playPrevious?: () => void;
  setVolume: (volume: number) => void;
  toggleMute?: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  shufflePlaylist?: () => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  playSimilar?: (mood?: string) => void;
  
  recommendByEmotion?: (emotion: string, intensity?: number) => MusicPlaylist;
  getRecommendedPlaylists?: (limit?: number) => MusicPlaylist[];
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  muted?: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute?: () => void;
}

export interface MusicControlsProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectPlaylist: (playlist: MusicPlaylist) => void;
  currentPlaylistId?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
}
