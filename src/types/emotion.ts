/**
 * @deprecated Ce fichier est remplacé par src/types/index.ts
 * Utilisez les types unifiés depuis src/types/index.ts
 */

// Réexportation pour compatibilité ascendante
export * from './index';

export interface EmotionVector {
  valence: number; // -1 à 1 (négatif à positif)
  arousal: number; // 0 à 1 (calme à excité)
  dominance: number; // 0 à 1 (soumis à dominant)
}

export interface BiometricData {
  heartRate?: number;
  breathingRate?: number;
  skinConductance?: number;
  eyeTracking?: {
    gazeDirection: { x: number; y: number };
    blinkRate: number;
    pupilDilation: number;
  };
  faceMetrics?: {
    expressionIntensity: number;
    microExpressions: string[];
    faceOrientation: { pitch: number; yaw: number; roll: number };
  };
}

export interface EmotionConfidence {
  overall: number; // 0-100
  facial?: number;
  vocal?: number;
  textual?: number;
  temporal?: number; // confiance basée sur la durée d'observation
}

export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: EmotionConfidence;
  timestamp: Date;
  source: EmotionSource;
  scanMode: ScanMode;
  duration: number; // en millisecondes
  
  // Données détaillées
  vector: EmotionVector;
  biometrics?: BiometricData;
  rawData?: any;
  
  // Contexte
  sessionId?: string;
  userId?: string;
  
  // Métadonnées
  details?: {
    environment?: 'home' | 'office' | 'outdoor' | 'public';
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    weatherContext?: string;
    socialContext?: 'alone' | 'with_others' | 'meeting' | 'call';
  };
  
  // Prédictions et insights
  predictions?: {
    nextEmotionLikely?: string;
    stabilityScore?: number; // probabilité de maintien de cet état
    recommendedActions?: string[];
  };
}

export interface EmotionRecommendation {
  id: string;
  type: 'activity' | 'music' | 'breathing' | 'meditation' | 'social' | 'environment' | 'journal';
  title: string;
  description: string;
  emotion: string;
  content: string;
  category: 'mindfulness' | 'music' | 'physical' | 'social' | 'reflection' | 'creative';
  
  // Métadonnées enrichies
  duration?: number; // durée estimée en minutes
  difficulty?: 'easy' | 'medium' | 'hard';
  effectiveness?: number; // score d'efficacité 0-100
  personalizedScore?: number; // score personnalisé basé sur l'historique
  
  // Ressources
  audioUrl?: string;
  videoUrl?: string;
  instructions?: string[];
  materials?: string[];
  
  // Tracking
  usageCount?: number;
  lastUsed?: Date;
  userRating?: number;
}

export interface EmotionTrend {
  date: string;
  averageMood: number;
  emotionDistribution: Record<string, number>;
  peakEmotion: string;
  lowestEmotion: string;
  stabilityIndex: number;
  sessionCount: number;
  totalScanTime: number;
}

export interface EmotionPattern {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'trigger-based';
  confidence: number;
  
  // Pattern data
  timePattern?: {
    hours: number[];
    daysOfWeek: number[];
    frequency: number;
  };
  
  emotionSequence?: {
    emotions: string[];
    transitions: Array<{ from: string; to: string; probability: number }>;
  };
  
  triggers?: {
    internal: string[]; // fatigue, stress, etc.
    external: string[]; // weather, social, work, etc.
  };
  
  outcomes?: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

export interface EmotionAnalysisConfig {
  duration: number; // durée de scan en secondes
  sensitivity: number; // 0-100
  sources: ScanMode[];
  
  // Configuration avancée
  realTimeUpdates?: boolean;
  biometricTracking?: boolean;
  environmentalContext?: boolean;
  
  // Filtres et seuils
  confidenceThreshold?: number;
  noiseReduction?: boolean;
  smoothingFactor?: number;
  
  // Personnalisation
  personalizedAlgorithms?: boolean;
  historicalContext?: boolean;
  predictiveMode?: boolean;
}

export interface ScanSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  results: EmotionResult[];
  config: EmotionAnalysisConfig;
  
  // Analytics
  averageConfidence: number;
  dominantEmotion: string;
  emotionChanges: number;
  stabilityScore: number;
  
  // Context
  location?: string;
  device?: string;
  appVersion?: string;
  notes?: string;
}

export interface EmotionInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'prediction' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Données de support
  evidenceData?: any;
  relatedResults?: string[]; // IDs des EmotionResult liés
  suggestions?: EmotionRecommendation[];
  
  // Métadonnées
  createdAt: Date;
  expiresAt?: Date;
  acknowledged?: boolean;
  actionTaken?: string;
}

export interface EmotionGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'increase_positive' | 'reduce_negative' | 'improve_stability' | 'custom';
  
  // Objectif mesurable
  targetMetric: string; // 'average_valence', 'positive_ratio', etc.
  currentValue: number;
  targetValue: number;
  deadline?: Date;
  
  // Progression
  progress: number; // 0-100
  milestones: Array<{
    value: number;
    achieved: boolean;
    achievedAt?: Date;
  }>;
  
  // Stratégie
  recommendedActions: EmotionRecommendation[];
  trackingFrequency: 'daily' | 'weekly' | 'monthly';
  
  createdAt: Date;
  updatedAt: Date;
}

// Types pour l'export et l'analyse
export interface EmotionDataExport {
  userId: string;
  exportDate: Date;
  dateRange: { start: Date; end: Date };
  
  sessions: ScanSession[];
  trends: EmotionTrend[];
  patterns: EmotionPattern[];
  insights: EmotionInsight[];
  goals: EmotionGoal[];
  
  analytics: {
    totalScans: number;
    averageSessionDuration: number;
    mostFrequentEmotion: string;
    emotionDiversity: number;
    overallWellbeingScore: number;
  };
}

// Types pour l'intégration temps réel
export interface RealTimeEmotionFeed {
  isActive: boolean;
  currentEmotion?: EmotionResult;
  emotionStream: EmotionResult[];
  
  // Configuration du stream
  updateInterval: number; // millisecondes
  bufferSize: number;
  smoothingEnabled: boolean;
  
  // Callbacks
  onEmotionChange?: (emotion: EmotionResult) => void;
  onPatternDetected?: (pattern: EmotionPattern) => void;
  onAnomalyDetected?: (anomaly: EmotionInsight) => void;
}