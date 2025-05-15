
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  audioUrl?: string;
  audio_url?: string;
  genre?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  cover_url?: string;
  cover?: string;
  description?: string;
  category?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
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
  cover?: string;
  duration?: number;
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showLabel?: boolean;
  className?: string;
}

export interface TrackInfoProps {
  track?: Track | null;
  className?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: number;
  genre?: string;
}
