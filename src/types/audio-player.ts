
export interface AudioPlayerState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

// Add the missing UseAudioPlayerStateReturn interface
export interface UseAudioPlayerStateReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  state: AudioPlayerState;
  controls: AudioPlayerControls;
  timeFormatted: {
    currentTime: string;
    duration: string;
  };
}
