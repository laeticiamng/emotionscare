
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  audioUrl?: string;
  audio_url?: string;
  mood?: string;
  emotion?: string;
  emotion_tag?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description: string;
  tracks: MusicTrack[];
  coverImage?: string;
  category?: string;
  coverUrl?: string;
  emotion?: string;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  playlist?: MusicPlaylist;
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
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  
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
