
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
  name?: string; // Pour compatibilité
  creator?: string; // Pour afficher l'auteur de la playlist
  author?: string; // Pour compatibilité
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
  openDrawer?: boolean;
}

export interface MusicContextType extends MusicState {
  // Fonctions de lecture
  play?: (track: MusicTrack, playlist?: MusicPlaylist) => void;
  pause?: () => void;
  pauseTrack?: () => void; // Alias pour pause
  resume?: () => void;
  resumeTrack?: () => void; // Alias pour resume
  stop?: () => void;
  next?: () => void;
  nextTrack?: () => void; // Alias pour next
  previous?: () => void;
  previousTrack?: () => void; // Alias pour previous
  prevTrack?: () => void; // Alias pour previous
  togglePlay?: () => void; // Basculer entre pause/play
  playTrack?: (track: MusicTrack) => void; // Alias pour play
  toggleRepeat?: () => void; // Toggle repeat mode

  // Contrôles
  setVolume?: (volume: number) => void;
  setMuted?: (muted: boolean) => void;
  toggleMute?: () => void;
  toggleShuffle?: () => void;
  setRepeat?: (mode: 'off' | 'track' | 'playlist') => void;
  seekTo?: (time: number) => void;

  // Gestion des playlists
  playPlaylist?: (playlist: MusicPlaylist, startTrackId?: string) => void;
  loadPlaylistForEmotion?: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  generateMusic?: (params: any) => Promise<MusicTrack | null>;
  setPlaylist?: (playlist: MusicPlaylist | null) => void;
  setCurrentTrack?: (track: MusicTrack | null) => void;
  
  // Gestion de la queue
  addToQueue?: (track: MusicTrack) => void;
  removeFromQueue?: (index: number) => void;
  clearQueue?: () => void;

  // UI state
  currentTime?: number;
  duration?: number;
  error?: Error | null;
  loading?: boolean;
  isInitialized?: boolean;
  playlist?: MusicPlaylist | null;
  toggleDrawer?: () => void;
  setOpenDrawer?: (open: boolean) => void;
  openDrawer?: boolean;
  
  // Emotion-specific
  setEmotion?: (emotion: string) => void;
  getRecommendationByEmotion?: (params: string | EmotionMusicParams) => Promise<MusicPlaylist | null>;
  
  // Aliases for compatibility
  setTrack?: (track: MusicTrack | null) => void;
  
  // Function to find tracks by mood
  findTracksByMood?: (mood: string) => MusicTrack[];
}

export interface EmotionMusicParams {
  emotion?: string;
  mood?: string;
  intensity?: number;
  genre?: string;
  tempo?: 'slow' | 'medium' | 'fast';
  duration?: number;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime?: (time: number) => string;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  muted?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
  className?: string;
}

export enum MusicCategory {
  ALL = 'all',
  FOCUS = 'focus',
  RELAX = 'relax',
  ENERGY = 'energy',
  SLEEP = 'sleep',
  MEDITATION = 'meditation'
}

export type MusicPlayerMode = 'mini' | 'full' | 'drawer';
