
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  audioUrl: string;
  coverUrl?: string;
  cover?: string;
  album?: string;
  genre?: string;
  mood?: string;
  year?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  coverUrl?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  emotion?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  playlists: MusicPlaylist[];
  queue: MusicTrack[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

export interface MusicDrawerProps {
  open: boolean;
  onClose: () => void;
  playlist?: MusicPlaylist;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  src: string;
  cover?: string;
}

export interface TrackInfoProps {
  track: MusicTrack | null;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  onSeek: (percentage: number) => void;
  currentTime: number;
  duration: number;
}

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
}
