
// Types related to emotion scanning and processing

import { Emotion, EmotionResult } from './emotion';
import { User } from './index';

export interface ScanFormData {
  text?: string;
  audio?: File | null;
  audio_url?: string;
  emojis?: string;
}

export interface ScanFilterOptions {
  period: '7' | '30' | '90';
  service: string;
  anonymized: boolean;
}

export interface ScanUserData {
  user: User;
  latestEmotion?: Emotion;
  emotionCount: number;
  averageScore: number;
}

export interface EmotionScanResponse {
  emotion: EmotionResult;
  recommendations?: string[];
}

export interface EmotionVisualizerParams {
  emotion: string;
  intensity?: number;
  size?: 'sm' | 'md' | 'lg';
  withLabel?: boolean;
  className?: string;
}
