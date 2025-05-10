
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  buffering: boolean;
  error: Error | null;
  track: any;
  repeat: 'none' | 'all' | 'one';
  shuffle: boolean;
}

export interface UseAudioPlayerStateReturn {
  audioPlayerState: AudioPlayerState;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setBuffering: (buffering: boolean) => void;
  setError: (error: Error | null) => void;
  setTrack: (track: any) => void;
  setRepeat: (repeat: 'none' | 'all' | 'one') => void;
  setShuffle: (shuffle: boolean) => void;
}
