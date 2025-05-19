
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
  source: string;
  coverImage: string;
  mood: string[];
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
  currentTrack: MusicTrack | null;
  setCurrentTrack: (track: MusicTrack | null) => void;
  playlist: MusicPlaylist | null;
  setPlaylist: (playlist: MusicPlaylist | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  volume?: number;
  setVolume?: (volume: number) => void;
  currentTime?: number;
  setCurrentTime?: (time: number) => void;
  duration?: number;
  setDuration?: (duration: number) => void;
  muted?: boolean;
  setMuted?: (muted: boolean) => void;
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  
  // Fonctions de contrôle
  playTrack?: (track: MusicTrack) => void;
  pauseTrack?: () => void;
  resumeTrack?: () => void;
  previousTrack?: () => void;
  nextTrack?: () => void;
  seekTo?: (time: number) => void;
  toggleMute?: () => void;
  
  // Fonctions spécifiques
  loadPlaylistForEmotion?: (params: EmotionMusicParams) => Promise<MusicPlaylist>;
  getRecommendationByEmotion?: (emotion: string, intensity?: number) => Promise<MusicPlaylist>;
  generateMusic?: (prompt: string) => Promise<MusicTrack>;
  
  // État et configuration
  isInitialized?: boolean;
}
