
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  description?: string;
  duration: number;
  url: string;
  audioUrl?: string;
  coverUrl?: string;
  category?: string;
  mood?: string;
  tags?: string[];
  source?: string;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  playlist: AudioTrack[];
  repeatMode: 'off' | 'one' | 'all';
  shuffleMode: boolean;
}

export interface AudioContextValue {
  audioState: AudioPlayerState;
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (position: number) => void;
  playTrack: (track: AudioTrack) => void;
  toggleShuffle: () => void;
  changeRepeatMode: () => void;
}
