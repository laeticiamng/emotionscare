
export interface Emotion {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  category?: string;
  intensity?: number;
}

export interface EmotionResult {
  emotion: string;
  score?: number;
  intensity?: number;
  date?: string;
  timestamp?: string;
  triggers?: string[];
  recommendations?: string[];
}

export interface EnhancedEmotionResult extends EmotionResult {
  icon?: string;
  color?: string;
  textColor?: string;
  description?: string;
  category?: string;
  triggers?: string[];
  coping_strategies?: string[];
  recommendations?: string[];
}

export interface EmotionalData {
  id: string;
  user_id: string;
  emotion: string;
  intensity: number;
  source?: string;
  context?: string;
  timestamp: string;
  feedback?: string;
  notes?: string;
}
