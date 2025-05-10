
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl?: string;
  url?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  imageUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  name?: string;
  emotion?: string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  onPlayMusic?: () => void;
  size?: 'small' | 'medium' | 'large';
  showControls?: boolean;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (value: number) => void;
  setCurrentTrack: (track: MusicTrack | null) => void;
  currentPlaylist?: MusicPlaylist | null;
  loadPlaylistForEmotion?: (emotion: string) => MusicPlaylist | null;
  loadPlaylistById?: (id: string) => MusicPlaylist | null;
  playlists?: MusicPlaylist[];
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  getTracksForEmotion?: (emotion: string) => MusicTrack[];
  currentEmotion?: string;
  initializeMusicSystem?: () => Promise<void>;
  error?: Error | null;
}
