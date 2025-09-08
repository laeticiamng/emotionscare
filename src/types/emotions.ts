
/**
 * @deprecated Ce fichier est remplacé par src/types/index.ts
 * Utilisez les types unifiés depuis src/types/index.ts
 */

// Réexportation pour compatibilité ascendante
export * from './index';

export interface EmotionAnalysis {
  id: string;
  userId: string;
  timestamp: Date;
  emotions: Emotion[];
  dominantEmotion: string;
  overallMood: string;
  confidence: number;
  source: 'text' | 'voice' | 'image';
  rawData?: any;
}

export interface EmotionTrend {
  date: string;
  averageMood: number;
  emotionDistribution: Record<string, number>;
}
