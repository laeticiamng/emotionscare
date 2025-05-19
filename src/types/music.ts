
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  duration?: number;
  audioUrl?: string;
  src?: string;
  track_url?: string;
  album?: string;
  year?: number;
  tags?: string[];
  genre?: string;
  emotion?: string;
  mood?: string;
  category?: string | string[];
  intensity?: number;
  name?: string; // Pour compatibilité
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  emotion?: string;
  mood?: string | string[];
  category?: string | string[];
  tags?: string[];
}

export interface MusicQueueItem extends MusicTrack {
  playlistId?: string;
}

export interface MusicState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  queue: MusicQueueItem[];
  history: MusicQueueItem[];
  repeat: 'off' | 'track' | 'playlist';
  shuffle: boolean;
  volume: number;
  muted: boolean;
}

export interface MusicContextType extends MusicState {
  // Fonctions de lecture
  play: (track: MusicTrack, playlist?: MusicPlaylist) => void;
  pause: () => void;
  pauseTrack?: () => void; // Alias pour pause
  resume: () => void;
  resumeTrack?: () => void; // Alias pour resume
  stop: () => void;
  next: () => void;
  nextTrack?: () => void; // Alias pour next
  previous: () => void;
  previousTrack?: () => void; // Alias pour previous
  togglePlay?: () => void; // Basculer entre pause/play
  playTrack?: (track: MusicTrack) => void; // Alias pour play

  // Contrôles
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeat: (mode: 'off' | 'track' | 'playlist') => void;
  seekTo: (time: number) => void;

  // Gestion des playlists
  playPlaylist: (playlist: MusicPlaylist, startTrackId?: string) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  generateMusic?: (params: any) => Promise<MusicTrack | null>;
  setPlaylist?: (playlist: MusicPlaylist | null) => void;
  setCurrentTrack?: (track: MusicTrack | null) => void;
  
  // Gestion de la queue
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;

  // UI state
  currentTime?: number;
  duration?: number;
  error?: Error | null;
  loading?: boolean;
  
  // UI controls
  toggleDrawer?: () => void;
  setOpenDrawer?: (open: boolean) => void;
}

export interface EmotionMusicParams {
  emotion?: string;
  mood?: string;
  intensity?: number;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  duration?: number;
}
