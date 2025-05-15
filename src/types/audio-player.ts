
// Types liés au player audio
export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  error: Error | null;
  progress: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  load: (url: string) => void;
  formatTime: (seconds: number) => string;
}
