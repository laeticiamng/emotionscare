export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration: number;
  coverUrl?: string;
  waveform?: number[];
}

export interface AudioPlaylist {
  id: string;
  title: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
}

export interface MoodData {
  mood: string;
  intensity: number;
  timestamp: Date;
  sentiment?: number;
  anxiety?: number;
  energy?: number;
}

export interface AudioProcessorProps {
  onAnalyze?: (data: EmotionalData) => void;
  onResult?: (result: any) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isRecording?: boolean;
  duration?: number;
  autoStart?: boolean;
  className?: string;
  mode?: 'continuous' | 'manual' | 'auto';
  visualize?: boolean;
  threshold?: number;
  children?: React.ReactNode;
}

export interface EmotionalData {
  primary: {
    emotion: string;
    confidence: number;
  };
  secondary?: {
    emotion: string;
    confidence: number;
  };
  timestamp: Date;
  source: string;
}

export interface AudioPlayerContextType {
  track: AudioTrack | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setTrack: (track: AudioTrack) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
}

export interface UseAudioPlayerStateReturn {
  track: AudioTrack;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  isLoading: boolean;
  error: string;
  setTrack: React.Dispatch<React.SetStateAction<AudioTrack>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  muted: boolean;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  currentTrack: AudioTrack;
  playTrack: (track: AudioTrack) => void;
}
