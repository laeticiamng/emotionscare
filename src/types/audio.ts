import { EmotionResult } from './emotion';
export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  url: string;
  cover?: string;
  emotion?: string;
  category?: string;
  tags?: string[];
  audioUrl?: string;
  description?: string;
}

export interface AudioPlaylist {
  id: string;
  name: string;
  tracks: AudioTrack[];
  createdAt: string;
  updatedAt?: string;
  coverImage?: string;
}

export interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isRecording?: boolean;
  duration?: number;
  autoStart?: boolean;
  className?: string;
  mode?: 'voice' | 'ambient' | 'both';
  visualize?: boolean;
}

// Types for emotional data in audio context
export interface MoodData {
  emotion: string;
  intensity: number;
  timestamp: string;
  sentiment?: number; // Added for MoodLineChart
  anxiety?: number; // Added for MoodLineChart
  energy?: number; // Added for MoodLineChart
}

export interface EmotionalData {
  userId: string;
  emotions: MoodData[];
  averageIntensity: number;
  dominantEmotion: string;
}
