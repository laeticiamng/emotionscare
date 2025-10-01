export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  isGenerated?: boolean;
  generatedAt?: string;
  sunoTaskId?: string;
  bpm?: number;
  key?: string;
  energy?: number;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: MusicTrack[];
  description?: string;
  tags?: string[];
  creator?: string;
  isTherapeutic?: boolean;
  targetEmotion?: string;
  duration?: number;
  coverUrl?: string;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  duration?: number;
  instrumental?: boolean;
  style?: string;
}

export interface GenerationRequest {
  emotion: string;
  prompt?: string;
  style: string;
  instrumental: boolean;
  model: string;
  duration?: number;
}

export interface GenerationResponse {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  imageUrl?: string;
  title?: string;
  duration?: number;
  error?: string;
}

// Type aliases for compatibility
export type Playlist = MusicPlaylist;
export type MusicCategory = 'therapeutic' | 'ambient' | 'focus' | 'energy' | 'relax' | 'sleep';

// Music state type (re-export from context will be needed)
export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

// Adaptive music configuration
export interface AdaptiveMusicConfig {
  enabled: boolean;
  emotionTarget?: string;
  intensityThreshold?: number;
  adaptiveVolume?: boolean;
}

// Re-export MusicContextType from context (will be imported where needed)
export type { MusicContextType } from '@/contexts/MusicContext';