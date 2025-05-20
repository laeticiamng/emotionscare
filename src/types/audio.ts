
import { EmotionResult } from './emotion';

export interface AudioProcessorProps {
  onResult?: (result: EmotionResult) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  isRecording?: boolean;
  duration?: number;
  autoStart?: boolean;
  className?: string;
  mode?: 'voice' | 'audio';
  visualize?: boolean;
}

export interface AudioPlaylist {
  id: string;
  title: string;
  description?: string;
  tracks: AudioTrack[];
  coverImage?: string;
  emotion?: string; // Adding this property to fix type error
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration?: number;
  coverImage?: string;
}
