
// Types for music-related components
export * from './index';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  url: string;
  audioUrl?: string;
  duration: number;
  cover?: string;
  coverUrl?: string;
  emotion?: string;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  coverImage?: string;
  emotion?: string;
  duration?: number;
  createdBy?: string;
}

export interface MusicPreferences {
  volume: number;
  autoplay: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  emotionSync: boolean;
  preferredGenres?: string[];
  audioQuality?: 'low' | 'medium' | 'high';
}

export interface MusicProviderOptions {
  autoInit?: boolean;
  defaultVolume?: number;
  emotionSyncEnabled?: boolean;
  onTrackChange?: (track: MusicTrack | null) => void;
  onError?: (error: Error) => void;
}

// For audio visualizers
export interface AudioVisualizerConfig {
  sensitivity: number;
  barCount: number;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
  barColorEnd?: string;
  smoothing?: number;
  animate?: boolean;
}
