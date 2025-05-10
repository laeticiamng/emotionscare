
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url?: string;
  audioUrl?: string;
  imageUrl?: string;
  cover?: string;
  coverUrl?: string;
  coverImage?: string;
  externalUrl?: string;
  mood?: string;
  genre?: string;
  emotion?: string; // Adding emotion property
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
  name: string;
  title?: string; // For compatibility
  description?: string;
  cover?: string;
  coverImage?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  created_at?: string | Date;
  updated_at?: string | Date;
  mood?: string;
  emotion?: string;
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
  intensity?: number;
  standalone?: boolean;
  onPlay?: () => void;
  tracks?: MusicTrack[];
  onClick?: () => void;
  className?: string;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  emotion?: string;
}

// Music context type definition
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
  openDrawer?: boolean;
  closeDrawer?: () => void;
  isDrawerOpen?: boolean;
  setOpenDrawer?: (open: boolean) => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<any>;
  currentPlaylist?: MusicPlaylist | null;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
  playlists?: MusicPlaylist[];
  loadPlaylistById?: (id: string) => void;
  getTracksForEmotion?: (emotion: string) => MusicTrack[];
  currentEmotion?: string;
}
