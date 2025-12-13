// @ts-nocheck
/**
 * Prediction Types - Système de prédiction émotionnelle
 * Types pour l'analyse prédictive, les modèles ML et les recommandations
 */

/** Prédiction d'émotion */
export interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence: number;
  predictedEmotion?: string;
  triggers?: string[];
  recommendations?: string[];
  category?: string;
  timestamp?: string;
  modelVersion?: string;
  features?: PredictionFeatures;
  metadata?: PredictionMetadata;
}

/** Caractéristiques utilisées pour la prédiction */
export interface PredictionFeatures {
  // Données temporelles
  timeOfDay: number;
  dayOfWeek: number;
  weekOfYear: number;
  monthOfYear: number;
  isWeekend: boolean;
  isHoliday: boolean;

  // Patterns historiques
  recentMoodAverage: number;
  moodVolatility: number;
  streakLength: number;
  daysSinceLastEntry: number;

  // Contexte
  sleepQuality?: number;
  activityLevel?: number;
  socialInteractions?: number;
  stressLevel?: number;
  weatherCondition?: string;

  // Biométriques
  heartRateVariability?: number;
  respiratoryRate?: number;
  skinConductance?: number;
}

/** Métadonnées de prédiction */
export interface PredictionMetadata {
  modelId: string;
  modelVersion: string;
  inferenceTime: number;
  inputDimensions: number;
  processingPipeline: string[];
  warnings?: string[];
}

/** Résultat de prédiction complet */
export interface PredictionResult {
  id: string;
  userId: string;
  timestamp: string;
  predictions: EmotionPrediction[];
  topPrediction: EmotionPrediction;
  alternativePredictions: EmotionPrediction[];
  overallConfidence: number;
  factors: PredictionFactor[];
  recommendations: PredictionRecommendation[];
  alerts?: PredictionAlert[];
  explainability?: ExplainabilityInfo;
}

/** Facteur influençant la prédiction */
export interface PredictionFactor {
  name: string;
  displayName: string;
  impact: number; // -1 à 1
  importance: number; // 0 à 1
  direction: 'positive' | 'negative' | 'neutral';
  description?: string;
  category: FactorCategory;
}

/** Catégorie de facteur */
export type FactorCategory =
  | 'temporal'
  | 'behavioral'
  | 'physiological'
  | 'environmental'
  | 'social'
  | 'historical';

/** Recommandation basée sur la prédiction */
export interface PredictionRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action?: RecommendedAction;
  expectedImpact: number;
  confidence: number;
  timing?: RecommendationTiming;
  resources?: RecommendationResource[];
}

/** Type de recommandation */
export type RecommendationType =
  | 'activity'
  | 'breathing'
  | 'meditation'
  | 'social'
  | 'rest'
  | 'nutrition'
  | 'movement'
  | 'mindfulness'
  | 'journaling'
  | 'professional';

/** Action recommandée */
export interface RecommendedAction {
  actionType: string;
  parameters?: Record<string, unknown>;
  duration?: number;
  url?: string;
}

/** Timing de recommandation */
export interface RecommendationTiming {
  suggestedTime?: string;
  duration: number;
  frequency?: 'once' | 'daily' | 'weekly';
  remindBefore?: number;
}

/** Ressource associée à une recommandation */
export interface RecommendationResource {
  type: 'article' | 'video' | 'audio' | 'exercise' | 'app';
  title: string;
  url?: string;
  duration?: number;
}

/** Alerte de prédiction */
export interface PredictionAlert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  actionRequired: boolean;
  suggestedActions?: string[];
  expiresAt?: string;
}

/** Type d'alerte */
export type AlertType =
  | 'mood_decline'
  | 'stress_spike'
  | 'pattern_change'
  | 'streak_at_risk'
  | 'health_concern'
  | 'positive_trend'
  | 'milestone';

/** Information d'explicabilité */
export interface ExplainabilityInfo {
  method: 'shap' | 'lime' | 'attention' | 'feature_importance';
  featureContributions: FeatureContribution[];
  counterfactuals?: Counterfactual[];
  localExplanation?: string;
  globalContext?: string;
}

/** Contribution d'une feature */
export interface FeatureContribution {
  feature: string;
  value: number | string;
  contribution: number;
  baselineValue?: number | string;
}

/** Explication contrefactuelle */
export interface Counterfactual {
  scenario: string;
  changedFeatures: Record<string, unknown>;
  predictedOutcome: string;
  probabilityChange: number;
}

/** Configuration du modèle de prédiction */
export interface PredictionModelConfig {
  modelId: string;
  version: string;
  type: ModelType;
  inputFeatures: string[];
  outputClasses: string[];
  threshold: number;
  maxPredictions: number;
  enableExplainability: boolean;
  cacheResults: boolean;
  cacheTtl: number;
}

/** Type de modèle */
export type ModelType =
  | 'classification'
  | 'regression'
  | 'sequence'
  | 'ensemble'
  | 'hybrid';

/** Historique de prédictions */
export interface PredictionHistory {
  userId: string;
  predictions: PredictionResult[];
  accuracy: AccuracyMetrics;
  trends: PredictionTrend[];
  period: {
    start: string;
    end: string;
  };
}

/** Métriques de précision */
export interface AccuracyMetrics {
  overall: number;
  byEmotion: Record<string, number>;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix?: number[][];
  samplesCount: number;
}

/** Tendance de prédiction */
export interface PredictionTrend {
  period: string;
  dominantEmotion: string;
  averageConfidence: number;
  volatility: number;
  improvementScore: number;
  direction: 'improving' | 'stable' | 'declining';
}

/** Entrée pour l'entraînement */
export interface TrainingDataPoint {
  features: PredictionFeatures;
  actualEmotion: string;
  timestamp: string;
  userId: string;
  validated: boolean;
}

/** Feedback sur une prédiction */
export interface PredictionFeedback {
  predictionId: string;
  userId: string;
  actualEmotion: string;
  wasAccurate: boolean;
  confidence: number;
  comments?: string;
  timestamp: string;
}

/** Statistiques de prédiction */
export interface PredictionStats {
  totalPredictions: number;
  accuratePredictions: number;
  averageConfidence: number;
  mostPredictedEmotion: string;
  mostAccurateFor: string;
  leastAccurateFor: string;
  averageInferenceTime: number;
  feedbackCount: number;
  lastUpdated: string;
}

/** Options de prédiction */
export interface PredictionOptions {
  includeAlternatives: boolean;
  maxAlternatives: number;
  minConfidence: number;
  includeFactors: boolean;
  includeRecommendations: boolean;
  includeExplainability: boolean;
  useCache: boolean;
  timeout: number;
}

/** Valeurs par défaut des options */
export const DEFAULT_PREDICTION_OPTIONS: PredictionOptions = {
  includeAlternatives: true,
  maxAlternatives: 3,
  minConfidence: 0.1,
  includeFactors: true,
  includeRecommendations: true,
  includeExplainability: false,
  useCache: true,
  timeout: 5000
};

/** Émotions prédictibles */
export const PREDICTABLE_EMOTIONS = [
  'happy',
  'sad',
  'angry',
  'fearful',
  'surprised',
  'disgusted',
  'neutral',
  'anxious',
  'calm',
  'excited'
] as const;

export type PredictableEmotion = typeof PREDICTABLE_EMOTIONS[number];

/** Type guard pour PredictableEmotion */
export function isPredictableEmotion(value: unknown): value is PredictableEmotion {
  return typeof value === 'string' && PREDICTABLE_EMOTIONS.includes(value as PredictableEmotion);
}

/** Calculer le score de confiance moyen */
export function calculateAverageConfidence(predictions: EmotionPrediction[]): number {
  if (predictions.length === 0) return 0;
  return predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
}

/** Obtenir la prédiction la plus probable */
export function getTopPrediction(predictions: EmotionPrediction[]): EmotionPrediction | null {
  if (predictions.length === 0) return null;
  return predictions.reduce((top, p) => p.probability > top.probability ? p : top);
}

export default {
  DEFAULT_PREDICTION_OPTIONS,
  PREDICTABLE_EMOTIONS,
  isPredictableEmotion,
  calculateAverageConfidence,
  getTopPrediction
};
