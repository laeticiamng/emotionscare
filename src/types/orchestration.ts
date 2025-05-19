
import { EmotionResult } from './emotion';

export interface MoodEvent {
  id: string;
  timestamp: Date;
  emotion: string;
  confidence: number;
  source: string;
  context: Record<string, any>;
}

export interface Prediction {
  id: string;
  timestamp: Date;
  emotion: string;
  confidence: number;
  prediction: string;
  recommendations: string[]; // Array of recommendation IDs
}

export interface PredictionRecommendation {
  id: string;
  type: 'vr_session' | 'music' | 'coaching' | 'activity';
  emotion: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface EmotionalLocation {
  id: string;
  name: string;
  coordinates?: { x: number; y: number };
  emotion: string;
  intensity: number;
  timestamp: Date;
}

export interface SanctuaryWidget {
  id: string;
  type: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  emotion?: string;
}

export interface EmotionalSynthesis {
  id: string;
  timestamp: Date;
  dominantEmotion: string;
  emotionHistory: string[];
  summary: string;
  recommendations: string[];
}

export interface OrchestrationEvent {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  processed: boolean;
}

export interface OrchestrationContextType {
  currentEmotionResult: EmotionResult | null;
  emotionHistory: EmotionResult[];
  moodEvents: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  sanctuaryWidgets: SanctuaryWidget[];
  emotionalLocations: EmotionalLocation[];
  synthesis: EmotionalSynthesis | null;
  events: OrchestrationEvent[];
  setCurrentEmotionResult: (result: EmotionResult) => void;
  addEmotionResult: (result: EmotionResult) => void;
  addEvent: (type: string, data: any) => void;
  processEmotionResult: (result: EmotionResult) => void;
  generatePredictions: () => void;
  getRecommendations: () => PredictionRecommendation[];
  clearHistory: () => void;
  refreshSynthesis: () => void;
}
