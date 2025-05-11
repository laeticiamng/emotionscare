
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  coverImage?: string;
  genre?: string;
  mood?: string;
  emotion?: string;
  audioUrl?: string;
  audio_url?: string;
  cover_url?: string;
  cover?: string;
  emotion_tag?: string;
  album?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description: string;
  coverUrl: string;
  emotion?: string;
  mood?: string;
  tracks: MusicTrack[];
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  playlists: MusicPlaylist[];
  volume: number;
  isInitialized: boolean;
  error: string | null;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  currentPlaylist?: MusicPlaylist | null;
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  resumeTrack?: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seek?: (time: number) => void;
  seekTo?: (time: number) => void;
  toggleShuffle?: () => void;
  toggleRepeat?: () => void;
  
  // Playlist management
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  shufflePlaylist: () => void;
  
  // Initialization
  initializeMusicSystem?: () => Promise<void>;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
}

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
  duration?: number;
}
