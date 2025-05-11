
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  url: string;
  duration: number;
  coverUrl?: string;
  coverImage?: string; // Added missing property
  genre?: string; // Added missing property
  mood?: string; // Added for compatibility
  emotion?: string; // Added for compatibility
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  emotion?: string; // Added for compatibility
  mood?: string; // Added for compatibility
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
  currentTime: number; // Added missing property
  duration: number; // Added missing property
  shuffle?: boolean; // Added missing property
  repeat?: boolean; // Added missing property
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void; // Used instead of resumeTrack
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seek?: (time: number) => void; // Added missing property (used instead of seekTo)
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
  currentPlaylist?: MusicPlaylist;
}

export interface Playlist {
  id: string;
  name: string;
  title: string;
  emotion: string;
  tracks: MusicTrack[];
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  playlist?: MusicPlaylist;
}

export interface Toast {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
  duration?: number; // Added missing property
}

export interface ChatResponse {
  text: string;
  follow_up_questions?: string[]; // Added missing property
  suggestions?: string[];
  sentiment?: string;
}

// Export other types that might be needed
export type { MusicTrack, MusicPlaylist, MusicContextType, MusicDrawerProps };
