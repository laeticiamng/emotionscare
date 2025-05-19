
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  cover?: string;
  coverUrl?: string;
  url: string;
  audioUrl?: string;
  duration: number;
  emotion?: string;
  isLiked?: boolean;
  name?: string;
}

export interface MusicPlaylist {
  id: string;
  title: string;
  name?: string;
  description?: string;
  coverUrl?: string;
  tracks: MusicTrack[];
  emotion?: string;
  isPublic?: boolean;
  userId?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  progress?: number;
  currentPlaylist: MusicPlaylist | null;
  playlists: MusicPlaylist[];
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  addToPlaylist: (trackId: string, playlistId: string) => void;
  removeFromPlaylist: (trackId: string, playlistId: string) => void;
  createPlaylist: (name: string, tracks?: MusicTrack[]) => void;
  playEmotion: (emotion: string) => void;
}

export interface MusicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  onChange?: (value: number) => void;
}

export interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  muted?: boolean;
  onToggleMute?: () => void;
}

export interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  muted?: boolean;
  onToggleMute?: () => void;
}

export interface MusicLibraryProps {
  onTrackSelect: (track: MusicTrack) => void;
}

export interface EmotionMusicParams {
  emotion: string;
  tempo?: number;
  intensity?: number;
}

export interface TrackInfoProps {
  track: MusicTrack;
  className?: string;
}
