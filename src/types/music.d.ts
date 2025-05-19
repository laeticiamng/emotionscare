
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  url?: string;
  coverUrl?: string;
  category?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  tracks: MusicTrack[];
  description?: string;
  emotion?: string;
  author?: string; // Added for compatibility
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  isRepeating: boolean;
  isShuffling: boolean;
  currentTime: number;
  togglePlay: () => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setVolume: (value: number) => void;
  setProgress: (value: number) => void;
  playTrack: (track: MusicTrack) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addTrack: (track: MusicTrack) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void; // Added to fix error
  setIsInitialized: (isInitialized: boolean) => void; // Added to fix error
}

export interface MusicDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  onMuteToggle: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  isRepeating?: boolean;
  isShuffling?: boolean;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRepeat?: () => void;
  onShuffle?: () => void;
}

export interface MusicLibraryProps {
  tracks: MusicTrack[];
  onSelect: (track: MusicTrack) => void;
  currentTrackId?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}
