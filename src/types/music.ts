
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string; // Alternative URL property
  imageUrl?: string;
  cover?: string; // Alternative cover property
  coverUrl?: string; // Adding coverUrl property
  coverImage?: string; // Another alternative cover property
  externalUrl?: string; // External URL for opening in music players
  mood?: string;
  genre?: string;
  releaseDate?: string;
  bpm?: number;
  key?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  is_favorite?: boolean;
  plays?: number;
  is_playing?: boolean;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  created_at?: string | Date;
  updated_at?: string | Date;
  mood?: string;
  emotion?: string; // Adding emotion property 
  user_id?: string;
  track_count?: number;
  duration?: number;
  is_public?: boolean;
  is_favorite?: boolean;
}

export interface MusicRecommendationCardProps {
  title?: string;
  description?: string;
  emotion?: string;
  intensity?: number; // Adding intensity property
  standalone?: boolean; // Adding standalone property
  onPlay?: () => void;
  tracks?: MusicTrack[];
  onClick?: () => void;
  className?: string;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean; // Add open as alternative to isOpen
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void; // Add onClose prop
  emotion?: string;
}

// Adding MusicContextType for MusicContext
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
  openDrawer?: () => void;
  closeDrawer?: () => void;
  isDrawerOpen?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<any>;
  currentPlaylist?: MusicPlaylist | null;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
}

