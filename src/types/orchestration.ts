
import { EmotionResult } from '@/types/emotion';

// Define needed orchestration types
export type EmotionSource = 'text' | 'voice' | 'facial' | 'manual' | 'ai' | 'system';

export interface MoodEvent {
  id: string;
  user_id: string;
  timestamp: string;
  mood: string;
  intensity: number;
  source: EmotionSource;
  context?: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  timestamp: string;
  prediction_type: string;
  prediction_data: any;
  confidence: number;
  expires_at?: string;
}

export interface PredictionRecommendation {
  id: string;
  prediction_id: string;
  type: string;
  title: string;
  description: string;
  action_url?: string;
  priority: number;
}

export interface EmotionalLocation {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  radius: number;
  emotion_profile: Record<string, number>;
  visits_count: number;
  last_visit?: string;
}

export interface SanctuaryWidget {
  id: string;
  type: string;
  title: string;
  content: any;
  priority: number;
  emotion_trigger?: string;
}

export interface EmotionalSynthesis {
  dominant_emotion: string;
  emotion_distribution: Record<string, number>;
  intensity_avg: number;
  period_start: string;
  period_end: string;
  data_points: number;
}

export interface OrchestrationEvent {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  user_id: string;
  source: string;
}
