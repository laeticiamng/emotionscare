
/**
 * Emotion Types
 * --------------------------------------
 * This file defines the official types for emotion functionality.
 * Any new property or correction must be documented here and synchronized across all mockData and components.
 */

export type EmotionIntensity = 'low' | 'medium' | 'high' | number;

export interface Emotion {
  id: string;
  name: string;
  label?: string; // Added for compatibility with various components
  color: string;
  intensity: EmotionIntensity;
  emoji?: string;
  description?: string;
  timestamp?: string; // When this emotion was recorded
  date?: string; // Alternative date format (to be standardized)
  tips?: string[];
  categories?: string[];
  value?: number; // For intensity visualization
}

export interface EmotionResult {
  id: string;
  emotion: string;
  score: number;
  confidence: number;
  text?: string;
  feedback?: string;
  intensity?: EmotionIntensity;
  timestamp?: string;
  date?: string;
  recommendations?: string[];
  emojis?: string[] | string;
  userId?: string;
  user_id?: string; // For compatibility, to be deprecated
  transcript?: string;
  ai_feedback?: string;
  source?: string;
  audioUrl?: string;
  audio_url?: string; // For compatibility, to be deprecated
  textInput?: string;
  facialExpression?: string;
  details?: Record<string, number>;
  duration?: number;
  category?: string;
  predictedEmotion?: string;
}

export interface EmotionStats {
  emotion: string;
  count: number;
  percentage: number;
}

export interface EmotionTrend {
  date: string;
  emotion: string;
  value: number;
}

export interface EmotionTimelineEntry {
  id: string;
  date: string;
  emotion: string;
  intensity: EmotionIntensity;
  note?: string;
}

export interface LiveVoiceScannerProps {
  onEmotionDetected?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  onFinish?: () => void;
  automaticMode?: boolean;
  instruction?: string;
  buttonText?: string;
  autoStart?: boolean;
  language?: string;
  duration?: number;
  className?: string;
  withAI?: boolean;
  onError?: (error: string) => void;
  continuous?: boolean;
}

export interface TeamOverviewProps {
  teamId?: string;
  period?: 'day' | 'week' | 'month';
  userId?: string;
  anonymized?: boolean;
  className?: string;
  dateRange?: any;
  users?: any[];
  showNames?: boolean;
  compact?: boolean;
}

export interface EmotionalTeamViewProps {
  teamId: string;
  period?: 'day' | 'week' | 'month' | string;
  dateRange?: [Date, Date];
  departments?: string[];
  showIndividuals?: boolean;
  compact?: boolean;
  anonymized?: boolean;
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
}
