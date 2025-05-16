
// Create or update the file for music-related types
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  category?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  coverUrl?: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  play: (track: MusicTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;
  isMuted: boolean;
  progress: number;
  duration: number;
  playlistId?: string;
  playlist?: MusicPlaylist;
  setPlaylist: (playlist: MusicPlaylist) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Music library props
export interface MusicLibraryProps {
  playlists: MusicPlaylist[];
  onSelectTrack: (track: MusicTrack) => void; // Add missing property
  onSelectPlaylist: (playlist: MusicPlaylist) => void; // Add missing property
}

// Add missing Track interface
export interface Track {
  id: string;
  title: string;
  artist?: string;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  cover?: string;
  duration?: number;
  emotion?: string;
  intensity?: number;
  category?: string;
}

// Add missing ProgressBarProps interface
export interface ProgressBarProps {
  progress: number;
  total: number;
  onSeek?: (position: number) => void;
}

// Add missing TrackInfoProps interface
export interface TrackInfoProps {
  track: MusicTrack | null;
}

// Add missing VolumeControlProps interface
export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Add missing EmotionMusicParams interface
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}
