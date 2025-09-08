
/**
 * @deprecated Ce fichier est remplacé par src/types/index.ts
 * Utilisez les types unifiés depuis src/types/index.ts
 */

// Réexportation pour compatibilité ascendante
export * from './index';

export interface EmotionPrediction {
  emotion: string;
  probability: number;
  intensity?: number;
  score?: number;
  category?: string;
}

export interface EmotionAnalysis {
  dominant: EmotionPrediction;
  emotions: EmotionPrediction[];
  sentiment: string;
  intensityScore: number;
  audioQuality?: number;
  confidence?: number;
}

export type EmotionSource = 'text' | 'voice' | 'facial' | 'combined';

export interface EmotionServiceOptions {
  detailed?: boolean;
  includeScores?: boolean;
  language?: string;
  source?: EmotionSource;
}
