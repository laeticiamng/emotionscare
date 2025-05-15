
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  type?: string;
  coverUrl?: string; // Add this for compatibility
  cover?: string;
  description?: string; // Add this for AudioPlayerSection
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | Error | null;
}

export interface AudioPlayerContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | Error | null;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  formatTime: (seconds: number) => string;
}

export interface UseAudioPlayerStateReturn {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  loading: boolean;
  error: string | Error | null;
  setCurrentTrack: (track: AudioTrack | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (isMuted: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingTrack: (loading: boolean) => void;
  setError: (error: string | Error | null) => void;
}
