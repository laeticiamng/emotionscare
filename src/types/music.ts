
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
  emotion?: string;
  intensity?: number;
  category?: string;
  source?: string;
  track_url?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (seconds: number) => string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  setVolume: (volume: number) => void;
  playlist?: MusicTrack[];
  setPlaylist?: (playlist: MusicPlaylist) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack?: () => void;
  previousTrack: () => void;
  duration: number;
  currentTime: number;
  progress?: number;
  seek?: (time: number) => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  muted?: boolean;
  isMuted?: boolean;
  toggleMute: () => void;
  playlists?: MusicPlaylist[];
  currentPlaylist?: MusicPlaylist | null;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: string | null;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  currentEmotion?: string | null;
  play?: (track: MusicTrack) => void;
  pause?: () => void;
  resume?: () => void;
  stop?: () => void;
  next?: () => void;
  previous?: () => void;
  mute?: () => void;
  unmute?: () => void;
  setProgress?: (progress: number) => void;
  isShuffled?: boolean;
  isRepeating?: boolean;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  queue?: MusicTrack[];
  addToQueue?: (track: MusicTrack) => void;
  clearQueue?: () => void;
  setEmotionMode?: (enabled: boolean) => void;
  emotionMode?: boolean;
  setCurrentEmotion?: (emotion: string | null) => void;
  findRecommendedTracksForEmotion?: (emotion: string, intensity?: number) => MusicTrack[];
}
