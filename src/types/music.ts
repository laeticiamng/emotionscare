
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  emotion?: string;
  lyrics?: string;
  // For backwards compatibility
  cover_url?: string;
  audio_url?: string;
  url?: string;
  emotion_tag?: string;
  cover?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
  // For backwards compatibility
  title?: string;
  cover_url?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  error?: string | null;
  currentEmotion?: string;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  playlist?: MusicPlaylist | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
