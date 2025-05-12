
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  audioUrl?: string;
  audio_url?: string;
  cover_url?: string;
  lyrics?: string;
  mood?: string;
  tempo?: number;
  genre?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name: string; // Adding name as required by the interface
  description?: string;
  coverUrl?: string;
  emotion?: string;
  tracks: MusicTrack[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicContextType {
  // Player state
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  volume: number;
  progress: number;
  duration: number;
  
  // Playback controls
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  togglePlay: () => void; // Adding missing method
  adjustVolume: (change: number) => void; // Adding missing method
  
  // Playlist management
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  
  // UI state
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  
  // Utility
  formatTime: (seconds: number) => string;
  
  // System state
  isInitialized: boolean;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  
  // Additional properties
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  currentEmotion: string | null;
  isMuted: boolean;
  toggleMute: () => void;
}
