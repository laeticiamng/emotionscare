
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl?: string;
  coverUrl?: string;
  coverImage?: string;
  duration: number;
  url?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  title: string;
  description?: string;
  tracks: MusicTrack[];
  emotion?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (value: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (value: number) => void;
  track?: MusicTrack;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
}

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string | null;
  
  play: (track: MusicTrack) => void;
  playTrack: (track: MusicTrack) => void;
  pause: () => void;
  pauseTrack: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  nextTrack: () => void;
  previous: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  mute: () => void;
  unmute: () => void;
  seekTo: (position: number) => void;
  setPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string | null) => void;
}
