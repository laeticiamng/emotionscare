
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  emotion?: string;
  lyrics?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  category?: string;
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
  openDrawer?: () => void;
  closeDrawer?: () => void;
  toggleDrawer?: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  error?: string | null;
  isInitialized?: boolean;
  initializeMusicSystem?: () => Promise<void>;
  currentEmotion?: string;
}
