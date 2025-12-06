// @ts-nocheck

import { MoodData } from '@/types/audio';

export interface MoodEvent {
  id: string;
  mood: string;
  timestamp: string;
  source: string;
  userId: string;
  intensity?: number;
}

export interface Prediction {
  id: string;
  predictedMood?: string;
  predictedEmotion?: string;
  confidence: number;
  timeframe: string;
  date: string;
  userId: string;
  mood?: string; // For compatibility
}

export interface PredictionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  effectiveness: number;
  mood?: string; // For compatibility
}

export interface EmotionalLocation {
  id: string;
  name: string;
  moodData: {
    primary: string;
    secondary: string;
    intensity: number;
  };
  coordinates: { lat: number; lng: number } | { x: number; y: number };
  userId: string;
}

export interface SanctuaryWidget {
  id: string;
  title: string;
  type: string;
  emotion: string;
  priority: number;
  description?: string; // For compatibility
}

export interface EmotionalSynthesis {
  id: string;
  userId: string;
  timestamp: string;
  emotionSummary: string;
  recommendations: PredictionRecommendation[];
  metrics: {
    dominantEmotion: string;
    emotionalStability: number;
    emotionalVariability: number;
  };
}

export interface OrchestrationEvent {
  id: string;
  type: string;
  timestamp: string;
  data: any;
}
