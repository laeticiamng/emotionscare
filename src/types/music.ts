
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
  emotion?: string;
  tags?: string[];
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  progress: number;
  duration: number;
  volume: number;
  isOpen: boolean;
  setOpenDrawer: (open: boolean) => void;
  loadPlaylistForEmotion: (emotion: string) => Promise<void>;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (value: number) => void;
  seek: (time: number) => void;
  currentPlaylist?: MusicTrack[];
}

export interface MusicRecommendationCardProps {
  emotion?: string;
  intensity?: number;
  standalone?: boolean;
}
