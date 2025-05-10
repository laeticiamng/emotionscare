
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  cover?: string;  
  coverImage?: string;  
  externalUrl?: string;  // For external player links
  mood?: string;
  genre?: string;
  intensity?: number;
  bpm?: number;
  tags?: string[];
  audioUrl?: string;
  emotion?: string; // Added emotion property that was missing
}

export interface MusicPlaylist {
  id: string;
  name: string;  
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  emotion?: string;
  createdAt?: Date | string;
}

export interface MusicRecommendationCardProps {
  emotion: string;
  intensity: number;
  standalone?: boolean;
  className?: string;
  track?: MusicTrack;
  recommendationReason?: string;
}

export interface MusicDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOpen?: boolean;
  currentTrack?: MusicTrack;
  onClose?: () => void;
}

// Add the missing MusicContextType interface
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
}
