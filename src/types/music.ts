
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  cover_url?: string;
  audio_url: string;
  emotion_tag?: string;
  intensity?: number;
  externalUrl?: string;
  genre?: string;
  
  // Add backward compatibility aliases
  coverUrl?: string;
  cover?: string;
  audioUrl?: string;
  url?: string;
  mood?: string;
  coverImage?: string;
  
  // For backward compatibility, mark audio_url as optional when url is available
  [key: string]: any; // To allow dynamic properties
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  emotion?: string;
  tracks: MusicTrack[];
  cover_url?: string;
  
  // Backward compatibility
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
  // Standard property
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // For backward compatibility
  isOpen?: boolean;
  onClose?: () => void;
}

// Define MusicContextType for MusicContext
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
  
  // Additional properties used in the context
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
