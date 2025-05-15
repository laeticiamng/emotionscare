
// Music-related types

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string; // Added for compatibility
  audio_url?: string; // Added for compatibility with older code
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title?: string; // For compatibility
  emotion?: string;
  tracks: MusicTrack[];
  description?: string;
  coverUrl?: string;
}

export interface TrackInfoProps {
  track: MusicTrack;
  onLike?: () => void;
  isLiked?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: MusicPlaylist;
  tracks?: MusicTrack[];
  currentTrack?: MusicTrack;
}

export interface MusicContextType {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  play: (track?: MusicTrack) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  selectTrack: (track: MusicTrack) => void;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  getRelatedTracks: (emotion: string) => MusicTrack[];
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export type Track = MusicTrack; // For compatibility
