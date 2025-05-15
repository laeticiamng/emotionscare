
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: number;
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
  played?: boolean;
  isPlaying?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  cover?: string;
  coverUrl?: string;
  cover_url?: string;
  emotion?: string;
  category?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlist: MusicPlaylist | null;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  playlist?: MusicPlaylist;
  currentTrack?: MusicTrack;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: any) => void;
  className?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion?: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
  genre?: string;
  mood?: string;
}
