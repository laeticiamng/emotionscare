
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  cover_url?: string;
  emotion?: string;
  genre?: string;
  album?: string;
  year?: number;
  isPlaying?: boolean;
  isFavorite?: boolean;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  duration?: number;
  trackCount?: number;
  createdBy?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  repeatMode: 'none' | 'one' | 'all';
  toggleRepeatMode: () => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration?: number;
  url?: string;
  coverUrl?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  formatTime?: (seconds: number) => string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  isPlaying?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
}
