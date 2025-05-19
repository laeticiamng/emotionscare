
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  currentTrack?: any;
  track?: any;
  loop: boolean;
  autoplay: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  seekTo?: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMuted: () => void;
  toggleMute?: () => void;
  toggleLoop: () => void;
  toggleAutoplay: () => void;
  playTrack?: (track: any) => void;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration?: number;
  coverUrl?: string;
  isLiked?: boolean;
}

export interface AudioPlayerContextType {
  track: AudioTrack | null;
  playlist: AudioTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToPlaylist: (track: AudioTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  clearPlaylist: () => void;
  shufflePlaylist: () => void;
  repeatMode: 'off' | 'track' | 'playlist';
  setRepeatMode: (mode: 'off' | 'track' | 'playlist') => void;
  likeTrack: (trackId: string) => void;
}
