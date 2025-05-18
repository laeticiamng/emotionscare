
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl: string;
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  src?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  album?: string;
  year?: number;
  genre?: string;
  name?: string;
  tags?: string[];
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  coverImage?: string;
  createdBy?: string;
  createdAt?: string;
  isPublic?: boolean;
  tags?: string[];
  title?: string;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  cover?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: MusicPlaylist | null;
  emotion: string | null;
  openDrawer: boolean;
  isInitialized: boolean;
  error?: Error | null;
  playlists?: MusicPlaylist[];
  
  // Actions
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setMute: (muted: boolean) => void;
  toggleMute?: () => void;
  seekTo: (time: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
  toggleDrawer?: () => void;
  closeDrawer?: () => void;
  setPlaylist?: (playlist: MusicPlaylist | MusicTrack[]) => void;
  setCurrentTrack?: (track: MusicTrack) => void;
  generateMusic?: (prompt: string) => Promise<MusicTrack | null>;
  getRecommendationByEmotion?: (emotion: string | EmotionMusicParams) => Promise<MusicPlaylist | MusicTrack[]>;
  isRepeating?: boolean;
  isShuffled?: boolean;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  queue?: MusicTrack[];
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  progress: number;
  onSeek?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
}

export interface MusicControlsProps {
  minimal?: boolean;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
}

export interface MusicPlayerProps {
  track: MusicTrack | null;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
}
