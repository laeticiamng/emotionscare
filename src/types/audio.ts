
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  audioUrl?: string;
  album?: string;
  genre?: string;
  emotion?: string;
  description?: string;
  coverImage?: string;
  cover?: string;
}

export interface AudioPlaylist {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: AudioTrack[];
  emotion?: string;
  mood?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface AudioContextType {
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
  togglePlay: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  progress: number;
  duration: number;
  seekTo: (time: number) => void;
  formatTime: (seconds: number) => string;
  loading: boolean;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylist?: (playlist: AudioPlaylist) => void;
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<AudioPlaylist | null>;
  setEmotion?: (emotion: string) => void;
  emotion?: string;
  error?: Error | null;
  isInitialized?: boolean;
}
