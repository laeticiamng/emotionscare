
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  cover?: string;
  coverImage?: string;
  audioUrl?: string;
  url?: string;
  emotion?: string;
  externalUrl?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
  cover?: string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity?: number;
  standalone?: boolean;
  className?: string;
}

export interface MusicDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadingTrack: boolean;
}
