
// Types pour les pistes musicales
export interface Track {
  id: string;
  title?: string;
  artist?: string;
  duration?: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  name?: string;
  coverImage?: string;
  mood?: string | string[];
  genre?: string;
  album?: string;
  tags?: string[];
  src?: string;
  track_url?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  name?: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  emotion?: string;
  mood?: string[];
  genre?: string;
  album?: string;
  tags?: string[];
}

// Types pour les playlists
export interface Playlist {
  id: string;
  name: string;
  emotion?: string;
  tracks: Track[];
  title?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  emotion?: string;
  tracks: MusicTrack[];
  description: string;
  source?: string;
  coverImage?: string;
  coverUrl?: string;
  cover?: string;
  mood: string[];
  tags?: string[];
}

// Types pour les paramètres
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  source?: string;
  genre?: string;
  tempo?: number;
}

// Type principal pour le contexte musical
export interface MusicContextType {
  // Current state
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  muted: boolean;
  openDrawer: boolean;
  isInitialized: boolean;
  playlists: MusicPlaylist[];
  isShuffled: boolean;
  isRepeating: boolean;
  queue: MusicTrack[];
  error: Error | null;
  
  // State setters
  setCurrentTrack: (track: MusicTrack | null) => void;
  setPlaylist: (playlist: MusicPlaylist | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setMuted: (muted: boolean) => void;
  setOpenDrawer: (open: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;
  
  // Control functions
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleDrawer: () => void;
  
  // Data functions
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  getRecommendationByEmotion: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  generateMusic: (prompt: string) => Promise<MusicTrack>;
  findTracksByMood: (mood: string) => MusicTrack[];
  setEmotion: (emotion: string) => void;
  
  // Playlist management
  loadPlaylist: (playlist: MusicPlaylist) => void;
  shufflePlaylist: () => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
}
