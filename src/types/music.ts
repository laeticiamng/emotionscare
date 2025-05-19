
export type MusicCategory = 'relaxation' | 'focus' | 'energy' | 'sleep' | 'happiness' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'meditation' | 'ambient' | 'nature';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  url: string;
  duration?: number;
  mood?: string | string[];
  category?: MusicCategory | MusicCategory[];
  bpm?: number;
  tags?: string[];
  isPlaying?: boolean;
  created_at?: string;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  description?: string;
  cover?: string;
  tracks: MusicTrack[];
  mood?: string | string[];
  emotion?: string;
  category?: MusicCategory | MusicCategory[];
  created_at?: string;
  author?: string;
}

export interface MusicContextType {
  // State
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  openDrawer: boolean;
  isInitialized: boolean;
  
  // Actions
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  setTrack: (track: MusicTrack) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  seekTo: (time: number) => void;
  setRepeat: (mode: 'off' | 'track' | 'playlist') => void;
  toggleShuffle: () => void;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<boolean>;
  getPlaylistById: (id: string) => MusicPlaylist | null;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  clearQueue: () => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

export interface Track extends MusicTrack {}

export interface MusicProviderProps {
  children: React.ReactNode;
}
