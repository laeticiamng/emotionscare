
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverImage?: string;
  mood?: string;
  url: string;
  previewUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  coverImage?: string;
  genre?: string;
  mood?: string;
  url?: string;
  previewUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks: Track[];
  creator?: string;
  mood?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  tracks: MusicTrack[];
  creator?: string;
  mood?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  progress: number;
  duration: number;
  emotion: string | null;
  setEmotion: (emotion: string | null) => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlayback: () => void;
  setProgress: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  loadPlaylist: (playlist: MusicTrack[]) => void;
  loadPlaylistForEmotion: (emotion: string) => void;
  isInitialized?: boolean;
  initializeMusicSystem?: () => void;
  error?: string | null;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onSeek?: (value: number) => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
}

export interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
}

export interface MusicLibraryProps {
  onSelectTrack?: (track: MusicTrack) => void;
}
