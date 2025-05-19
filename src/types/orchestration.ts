
// Orchestration types
export type EmotionSource = 
  | 'text'
  | 'voice'
  | 'facial'
  | 'emoji'
  | 'system'
  | 'ai'
  | 'live-voice'
  | 'voice-analyzer'
  | 'audio-processor'
  | 'text-analysis';

export interface MoodEvent {
  id: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  source: EmotionSource;
  context?: string;
  userId?: string;
}

export interface Prediction {
  id: string;
  emotion: string;
  probability: number;
  timeframe: 'hour' | 'day' | 'week';
  triggers?: string[];
  timestamp: string;
  userId: string;
}

export interface PredictionRecommendation {
  id: string;
  action: string;
  description: string;
  category: string;
  predictionId: string;
  impact: number;
}

export interface EmotionalLocation {
  id: string;
  name: string;
  description?: string;
  emotionTags: string[];
  intensity: number;
  coordinates?: {
    lat: number;
    long: number;
  };
}

export interface SanctuaryWidget {
  id: string;
  type: 'meditation' | 'breathing' | 'journal' | 'music' | 'vr';
  title: string;
  description: string;
  emotionTags: string[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface EmotionalSynthesis {
  id: string;
  userId: string;
  dominantEmotion: string;
  emotionalSignature: Record<string, number>;
  lastUpdate: string;
  period: 'day' | 'week' | 'month';
  trends: {
    emotion: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
  }[];
}

export interface OrchestrationEvent {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  source: string;
  userId: string;
}
