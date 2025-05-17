
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  emotion?: string;
  // Add track_url for compatibility
  track_url?: string;
  coverUrl?: string;
  coverImage?: string;
  cover?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist?: MusicTrack[] | null;
  currentPlaylist?: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted?: boolean;
  currentTime: number;
  duration: number;
  progress?: number;
  currentEmotion?: string | null;
  emotion?: string | null;
  error?: Error | null;
  isInitialized?: boolean;
  openDrawer?: boolean;
  isShuffled?: boolean;
  isRepeating?: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack?: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  setOpenDrawer?: (isOpen: boolean) => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  initializeMusicSystem?: () => Promise<boolean>;
}
