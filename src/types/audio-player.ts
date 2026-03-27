// @ts-nocheck
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioPlayerControls {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export type AudioPlayerHook = AudioPlayerState & AudioPlayerControls;

export interface UseAudioPlayerStateReturn extends AudioPlayerState {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  setIsPlaying: (v: boolean) => void;
  setCurrentTime: (v: number) => void;
  setDuration: (v: number) => void;
  setVolume: (v: number) => void;
  setIsMuted: (v: boolean) => void;
  setIsLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
}
