
export interface Emotion {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  intensity: number;
  notes?: string;
  sources?: string[];
  context?: Record<string, any>;
}

export interface EmotionPrediction {
  name: string;
  score: number;
  intensity: number;
  confidence: number;
}

export interface EmotionalData {
  id?: string;
  timestamp: string;
  dominant_emotion: string;
  valence: number;
  arousal: number;
  context?: string;
  notes?: string;
  source?: string;
  feedback?: string;
}

export interface EmotionResult {
  dominantEmotion: string;
  emotions: EmotionPrediction[];
  analysis: string;
  recommendations: string[];
  timestamp: string;
  audio_url?: string; // Optional field for audio analyses
}

export interface EmotionStats {
  mostFrequent: string;
  averageIntensity: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  trend: 'improving' | 'stable' | 'declining' | 'mixed';
}
