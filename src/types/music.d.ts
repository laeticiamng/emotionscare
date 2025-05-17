
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  trackUrl?: string;
  coverUrl?: string;
  cover_url?: string;
  mood?: string;
  emotionalTone?: string;
  track_url?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  mood?: string;
  category?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
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
  queue?: MusicTrack[];
  clearQueue?: () => void;
  addToQueue?: (track: MusicTrack) => void;
  shufflePlaylist?: () => void;
  loadPlaylist?: (playlist: MusicPlaylist) => void;
  isShuffled?: boolean;
  isRepeating?: boolean;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  error?: Error | null;
  isInitialized?: boolean;
}
