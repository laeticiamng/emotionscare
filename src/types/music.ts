
// Music type definitions
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  album?: string;
  cover_url?: string;
  track_url: string;
  genre?: string;
  emotion?: string;
  tempo?: number;
  energy?: number;
  valence?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  tracks: MusicTrack[];
  created_by?: string;
  is_public?: boolean;
  emotion?: string;
  duration?: number;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  playlist: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  addToPlaylist: (track: MusicTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  shuffle: () => void;
  repeat: boolean;
  toggleRepeat: () => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  src: string;
  duration: number;
}

export interface ProgressBarProps {
  progress: number;
  duration: number;
  onChange: (value: number) => void;
}

export interface TrackInfoProps {
  title: string;
  artist: string;
  cover?: string;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (value: number) => void;
}

export interface MusicLibraryProps {
  onSelectTrack: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  tempo?: 'slow' | 'medium' | 'fast';
  instrument?: string;
  duration?: number;
}
