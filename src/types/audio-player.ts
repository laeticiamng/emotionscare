
export interface AudioPreference {
  volume: number;
  autoplay: boolean;
  equalizerEnabled: boolean;
  equalizerPresets: string[];
  selectedPreset: string;
  setVolume: (volume: number) => void;
  setAutoplay: (autoplay: boolean) => void;
  toggleEqualizer: () => void;
  setEqualizerPreset: (preset: string) => void;
}

export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
}

export interface UseAudioPlayerStateReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  currentTrack: any;
  nextTrack: () => void;
  previousTrack: () => void;
  setCurrentTrack: (track: any) => void;
}
