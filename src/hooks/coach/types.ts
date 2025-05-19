
export interface EmotionalTrend {
  emotion: string;
  count: number;
  average: number;
  change: number;
  period: string;
}

export interface EmotionalData {
  id: string;
  user_id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source?: EmotionSource;
  context?: string;
  tags?: string[];
  value?: number; // Added to support existing codebase
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'manual' | 'ai' | 'system' | 'emoji' | 'live-voice' | 'voice-analyzer' | 'audio-processor' | 'text-analysis';

export interface EmotionalStats {
  dominant: string;
  average: number;
  count: number;
  timeline: {
    date: string;
    value: number;
    emotion: string;
  }[];
}

export interface EmotionalRecommendation {
  type: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionText?: string;
}

// Add the CoachNotification type that's missing from lib/coach/types
export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date | string;
  read?: boolean;
  action?: {
    id: string;
    type: string;
    payload: any;
  };
}
