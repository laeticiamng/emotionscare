
import { EmotionResult } from '@/types/emotion';

// Types de base pour l'orchestration
export type EmotionSource = 'text' | 'voice' | 'facial' | 'emoji' | 'system' | 'journal';
export type EmotionCategory = 'regular' | 'milestone' | 'highlight' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high';
export type RecommendationStatus = 'pending' | 'active' | 'completed' | 'dismissed';
export type InsightType = 'pattern' | 'trigger' | 'improvement' | 'connection';

// Événement émotionnel
export interface MoodEvent {
  id: string;
  timestamp: string;
  mood: string;
  source: EmotionSource;
  intensity: number;
  emotion?: EmotionResult;
  notes?: string;
  category: EmotionCategory;
  tags?: string[];
  relatedEvents?: string[];
}

// Localisation émotionnelle pour la carte du monde
export interface EmotionalLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  emotion: string;
  intensity: number;
  timestamp: string;
  color: string;
  notes?: string;
  relatedEvents?: string[];
}

// Widget pour le sanctuaire
export interface SanctuaryWidget {
  id: string;
  type: 'meditation' | 'breathing' | 'ambient' | 'visualization' | 'journal';
  title: string;
  description: string;
  duration: number;
  completions: number;
  thumbnail: string;
  color: string;
  audioUrl?: string;
  videoUrl?: string;
}

// Prédiction
export interface Prediction {
  id: string;
  timestamp: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  relatedEmotions: string[];
  relatedEvents?: string[];
  suggestions?: string[];
}

// Recommandation basée sur les prédictions
export interface PredictionRecommendation {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  dueDate?: string;
  completedDate?: string;
  completed?: boolean;
  relatedPrediction?: string;
  category?: string;
  actionType?: string;
}

// Synthèse émotionnelle globale
export interface EmotionalSynthesis {
  id: string;
  timestamp: string;
  period: 'day' | 'week' | 'month' | 'year';
  dominantEmotion: string;
  emotionDistribution: Record<string, number>;
  volatility: number;
  averageIntensity: number;
  patterns: string[];
  insights: string[];
  recommendations: string[];
}

// Actions pour le reducer d'orchestration
export type OrchestrationEvent =
  | { type: 'EMOTION_DETECTED'; payload: EmotionResult }
  | { type: 'MILESTONE_REACHED'; payload: MoodEvent }
  | { type: 'RECOMMENDATION_ADDED'; payload: PredictionRecommendation }
  | { type: 'RECOMMENDATION_COMPLETED'; payload: string }
  | { type: 'INSIGHT_GENERATED'; payload: Prediction }
  | { type: 'SYNTHESIS_UPDATED'; payload: EmotionalSynthesis };

// Interface du contexte d'orchestration partagé
export interface OrchestrationContextType {
  events: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  locations: EmotionalLocation[];
  sanctuaryWidgets: SanctuaryWidget[];
  synthesis: EmotionalSynthesis | null;
  activeLocation: string | null;
  activeEvent: string | null;
  loading: boolean;

  addEvent: (event: MoodEvent) => void;
  addEmotionResult: (result: EmotionResult) => void;
  addRecommendation: (recommendation: PredictionRecommendation) => void;
  completeRecommendation: (id: string) => void;
  addPrediction: (prediction: Prediction) => void;
  setActiveLocation: (id: string | null) => void;
  setActiveEvent: (id: string | null) => void;
  updateSynthesis: (synthesis: EmotionalSynthesis) => void;
}
