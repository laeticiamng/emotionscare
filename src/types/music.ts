
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover_url?: string;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  bpm?: number;
  mood?: string;
  intensity?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  mood?: string;
  cover_url?: string;
}

export interface MusicRecommendationCardProps {
  title: string;
  emotion?: string;
  onSelect?: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  volume: number;
  openDrawer: boolean;
  error: string | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setOpenDrawer: (open: boolean) => void;
  // Ajout des propriétés manquantes
  playlists?: MusicPlaylist[];
  loadPlaylistById?: (id: string) => Promise<MusicPlaylist | null>;
  currentEmotion?: string;
  toggleRepeat?: () => void;
  toggleShuffle?: () => void;
  loadPlaylistForEmotion?: (emotion: string) => Promise<MusicPlaylist | null>;
  initializeMusicSystem: () => Promise<void>;
}
