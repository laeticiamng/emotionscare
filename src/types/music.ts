
// Types liés à la musique et au lecteur audio
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  cover_url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  emotion?: string;
  tracks: MusicTrack[];
  title?: string;
  category?: string;
  coverUrl?: string;
}

export interface MusicContextType {
  playlists: MusicPlaylist[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  loadPlaylists: () => Promise<void>;
  loadPlaylistById: (id: string) => Promise<MusicPlaylist | null>;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (time: number) => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
}

export interface TrackInfoProps {
  track: MusicTrack;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  currentTime?: number;
  duration?: number;
  formatTime?: (seconds: number) => string;
  handleProgressClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
  coverUrl?: string;
  audioUrl?: string;
  emotion?: string;
  cover_url?: string;
}
