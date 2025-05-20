
export interface AudioTrack {
  id: string;
  title: string;
  url: string;
  duration: number;
  artist?: string;
  album?: string;
  genre?: string;
  coverUrl?: string;
  // Added properties for compatibility
  audioUrl?: string;
  description?: string;
  summary?: string;
  metadata?: Record<string, any>;
  isPlaying?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: AudioTrack[];
  coverUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  isPublic?: boolean;
}

export interface AudioQueueItem {
  id: string;
  track: AudioTrack;
  addedAt: string;
}

export type AudioRepeatMode = 'off' | 'all' | 'one';

export interface AudioVisualizationOptions {
  type: 'waveform' | 'bars' | 'circular';
  color: string;
  backgroundColor?: string;
  sensitive?: boolean;
  height?: number;
  width?: number;
}

export interface AudioPlayerOptions {
  autoPlay?: boolean;
  showVisualizer?: boolean;
  visualizerOptions?: AudioVisualizationOptions;
  showPlaylist?: boolean;
  allowShuffle?: boolean;
  allowRepeat?: boolean;
  showProgress?: boolean;
  showVolume?: boolean;
  compact?: boolean;
}

export interface AudioRecorderOptions {
  maxDuration?: number;
  autoStart?: boolean;
  format?: 'mp3' | 'wav' | 'ogg';
  quality?: 'low' | 'medium' | 'high';
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  sampleRate?: number;
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  playlist: AudioPlaylist | null;
  queue: AudioQueueItem[];
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: number;
  repeat: AudioRepeatMode;
  shuffle: boolean;
  isLoading: boolean;
  error: Error | null;
}
