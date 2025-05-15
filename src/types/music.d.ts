
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
  image_url?: string;
  category?: string;
  mood?: string;
  tags?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicPlaylist {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  tracks: MusicTrack[];
  category?: string;
  coverUrl?: string;
  image_url?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleMute: () => void;
  isMuted: boolean;
}

export interface MusicDrawerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  progress: number;
  duration: number;
  onSeek: (position: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  children?: React.ReactNode;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  coverUrl?: string;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (event: React.MouseEvent) => void;
  showTimestamps?: boolean;
  className?: string;
  variant?: string;
  showLabel?: boolean;
  onSeek?: (value: number) => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  onChange?: (value: number) => void;
}

export interface MusicLibraryProps {
  playlists?: MusicPlaylist[];
  tracks?: MusicTrack[];
  onSelectPlaylist?: (playlist: MusicPlaylist) => void;
  onSelectTrack?: (track: MusicTrack) => void;
}
