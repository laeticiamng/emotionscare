
// Define the MusicTrack interface
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  duration: number;
  emotion?: string;
  genre?: string;
  intensity?: number;
  isPlaying?: boolean;
}

// Define the MusicPlaylist interface
export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  createdAt?: string;
  userId?: string;
  isRecommended?: boolean;
}

// Define MusicContextType
export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<MusicPlaylist | null>;
  getTracksForEmotion: (emotion: string) => MusicTrack[];
  currentEmotion: string;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  initializeMusicSystem: () => Promise<void>;
  error: string | null;
  playlists: MusicPlaylist[];
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
}

// Define MusicRecommendationCardProps interface
export interface MusicRecommendationCardProps {
  emotion: string;
  tracks?: MusicTrack[];
  onTrackSelect?: (track: MusicTrack) => void;
  isLoading?: boolean;
  intensity?: number;
  standalone?: boolean;
}

// Define MusicDrawerProps interface
export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}
