
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  cover_url?: string;
  audio_url?: string;
  emotion_tag?: string;
  intensity?: number;
  externalUrl?: string;
  genre?: string;
  
  // Alias pour la compatibilité
  coverUrl?: string;
  cover?: string;
  audioUrl?: string;
  url?: string;
  mood?: string;
  coverImage?: string;
  
  // Pour la compatibilité
  [key: string]: any;
}

export interface MusicPlaylist {
  id: string;
  title?: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  cover_url?: string;
  
  // Pour la compatibilité
  name?: string;
  coverUrl?: string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  // Propriété standard
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Pour la compatibilité
  isOpen?: boolean;
  onClose?: () => void;
}

// Définir MusicContextType pour MusicContext
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  
  // Propriétés supplémentaires utilisées dans le contexte
  openDrawer?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  currentPlaylist?: MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  loadPlaylistForEmotion?: (emotion: string) => MusicPlaylist | null;
  loadPlaylistById?: (id: string) => MusicPlaylist | null;
  getTracksForEmotion?: (emotion: string) => MusicTrack[];
  currentEmotion?: string;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
}
