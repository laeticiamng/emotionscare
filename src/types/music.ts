
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
