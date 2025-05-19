
export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp?: string;
  source?: string;
  recommendations?: string[] | EmotionRecommendation[];
  data?: any;
  metadata?: any;
}

export interface EmotionRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  emotion: string;
  content?: string;
  category?: string;
}

// Types compatibles pour les hooks qui utilisent différentes structures
export type EmotionRecommendationCompatible = string | EmotionRecommendation;
