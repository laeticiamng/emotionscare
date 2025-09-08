/**
 * TYPES UNIFIÉS - Intelligence Émotionnelle Premium
 * Architecture unifiée pour tous les services d'analyse émotionnelle
 */

export type EmotionSource = 'hume_face' | 'hume_voice' | 'openai_text' | 'biometric' | 'multimodal';
export type ScanMode = 'quick' | 'detailed' | 'realtime' | 'session';
export type EmotionCategory = 'positive' | 'negative' | 'neutral' | 'complex';

// Émotions standardisées compatibles Hume AI
export const EMOTION_LABELS = {
  // Positive emotions
  'joy': { category: 'positive', intensity: 'high', color: '#22c55e' },
  'amusement': { category: 'positive', intensity: 'medium', color: '#84cc16' },
  'contentment': { category: 'positive', intensity: 'low', color: '#65a30d' },
  'excitement': { category: 'positive', intensity: 'high', color: '#f59e0b' },
  'serenity': { category: 'positive', intensity: 'low', color: '#06b6d4' },
  
  // Negative emotions
  'anger': { category: 'negative', intensity: 'high', color: '#ef4444' },
  'sadness': { category: 'negative', intensity: 'medium', color: '#3b82f6' },
  'fear': { category: 'negative', intensity: 'high', color: '#8b5cf6' },
  'disgust': { category: 'negative', intensity: 'medium', color: '#10b981' },
  'anxiety': { category: 'negative', intensity: 'high', color: '#f97316' },
  
  // Neutral/Complex emotions
  'surprise': { category: 'neutral', intensity: 'medium', color: '#64748b' },
  'concentration': { category: 'neutral', intensity: 'medium', color: '#475569' },
  'contemplation': { category: 'neutral', intensity: 'low', color: '#6b7280' },
  'confusion': { category: 'complex', intensity: 'medium', color: '#94a3b8' },
} as const;

export type EmotionLabel = keyof typeof EMOTION_LABELS;

// Vecteur émotionnel unifié (compatible avec recherche scientifique)
export interface EmotionVector {
  valence: number;      // -1 (très négatif) à 1 (très positif)  
  arousal: number;      // 0 (très calme) à 1 (très excité)
  dominance: number;    // 0 (soumis) à 1 (dominant)
  stability: number;    // 0 (instable) à 1 (stable)
}

// Données biométriques enrichies
export interface BiometricData {
  heartRate?: {
    bpm: number;
    variability: number;
    trend: 'rising' | 'falling' | 'stable';
  };
  breathing?: {
    rate: number;
    depth: number;
    pattern: 'regular' | 'irregular' | 'shallow' | 'deep';
  };
  skinConductance?: {
    level: number;
    peaks: number;
    baseline: number;
  };
  eyeTracking?: {
    gazeStability: number;
    blinkRate: number;
    pupilDilation: number;
    fixationDuration: number;
  };
  facialMetrics?: {
    actionUnits: Record<string, number>; // FACS codes
    asymmetry: number;
    tension: number;
    microExpressions: Array<{
      expression: string;
      confidence: number;
      duration: number;
    }>;
  };
}

// Analyse émotionnelle unifiée 
export interface UnifiedEmotionAnalysis {
  id: string;
  timestamp: Date;
  duration: number; // millisecondes
  
  // Résultats principaux
  primaryEmotion: EmotionLabel;
  emotions: Array<{
    emotion: EmotionLabel;
    confidence: number;   // 0-1
    intensity: number;    // 0-1
    source: EmotionSource;
  }>;
  
  // Analyse vectorielle
  emotionVector: EmotionVector;
  
  // Métriques de qualité
  overallConfidence: number;
  dataQuality: number;    // qualité des données d'entrée
  processingTime: number; // temps de traitement en ms
  
  // Sources et contexte
  sources: EmotionSource[];
  scanMode: ScanMode;
  biometrics?: BiometricData;
  
  // Métadonnées contextuelles
  context?: {
    environment: 'office' | 'home' | 'outdoor' | 'transport' | 'unknown';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    socialContext: 'alone' | 'with_people' | 'meeting' | 'call';
    deviceType: 'mobile' | 'desktop' | 'tablet' | 'vr';
    location?: string;
  };
  
  // Données brutes (pour debug et amélioration)
  rawData?: {
    hume?: any;
    openai?: any;
    biometric?: any;
  };
}

// Recommandations intelligentes
export interface SmartRecommendation {
  id: string;
  type: 'music' | 'breathing' | 'meditation' | 'activity' | 'environment' | 'social';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Contenu
  title: string;
  description: string;
  instructions?: string[];
  
  // Ciblage émotionnel
  targetEmotion: EmotionLabel;
  expectedOutcome: EmotionLabel;
  effectiveness: number; // 0-100 basé sur données historiques
  
  // Ressources
  content?: {
    audioUrl?: string;
    videoUrl?: string;
    imageUrl?: string;
    text?: string;
  };
  
  // Paramètres
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Personnalisation
  personalizedScore: number; // basé sur historique utilisateur
  adaptiveParameters?: Record<string, any>;
  
  // Tracking
  usageCount: number;
  successRate: number; // % de fois où l'émotion cible a été atteinte
  lastUsed?: Date;
  userFeedback?: number; // 1-5 stars
}

// Session de scan unifiée
export interface UnifiedScanSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  
  // Configuration
  config: {
    scanMode: ScanMode;
    duration: number; // secondes planifiées
    sources: EmotionSource[];
    realTimeUpdates: boolean;
    biometricTracking: boolean;
    environmentalContext: boolean;
    adaptiveScanning: boolean; // ajuste la fréquence selon les résultats
  };
  
  // Résultats
  analyses: UnifiedEmotionAnalysis[];
  recommendations: SmartRecommendation[];
  
  // Métriques de session
  sessionMetrics: {
    totalAnalyses: number;
    averageConfidence: number;
    dominantEmotion: EmotionLabel;
    emotionChanges: number;
    stabilityScore: number;
    dataQualityScore: number;
  };
  
  // Contexte et metadata
  context: {
    device: string;
    location?: string;
    weather?: string;
    appVersion: string;
  };
  
  notes?: string;
  tags?: string[];
}

// Insights et patterns avancés
export interface EmotionInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'trend' | 'milestone' | 'recommendation';
  severity: 'info' | 'warning' | 'important' | 'critical';
  
  // Contenu
  title: string;
  description: string;
  summary: string;
  
  // Données de support
  confidence: number;
  evidence: {
    dataPoints: number;
    timeRange: { start: Date; end: Date };
    correlations?: Array<{
      factor: string;
      strength: number;
      description: string;
    }>;
  };
  
  // Actions suggérées
  actions: SmartRecommendation[];
  
  // Métadonnées
  createdAt: Date;
  expiresAt?: Date;
  priority: number; // 1-10
  acknowledged: boolean;
  actionTaken?: {
    action: string;
    timestamp: Date;
    result?: string;
  };
}

// Configuration d'analyse adaptative
export interface AdaptiveAnalysisConfig {
  // Sensibilité dynamique
  sensitivityMode: 'low' | 'medium' | 'high' | 'adaptive';
  
  // Personnalisation
  userPersonality?: {
    introversion: number;    // 0-1
    emotionalStability: number; // 0-1
    sensitivity: number;     // 0-1
    expressiveness: number;  // 0-1
  };
  
  // Historique et apprentissage
  learningEnabled: boolean;
  historicalWeighting: number; // 0-1, influence de l'historique
  adaptiveThresholds: boolean; // ajuste les seuils selon l'utilisateur
  
  // Performance
  maxProcessingTime: number; // ms
  qualityThreshold: number;  // seuil minimal de qualité
  confidenceThreshold: number; // seuil minimal de confiance
  
  // Filtres
  noiseReduction: boolean;
  smoothingFactor: number; // 0-1
  outlierDetection: boolean;
}

// Export d'analyse complète
export interface EmotionAnalysisExport {
  userId: string;
  exportDate: Date;
  timeRange: { start: Date; end: Date };
  
  // Données principales
  sessions: UnifiedScanSession[];
  insights: EmotionInsight[];
  recommendations: SmartRecommendation[];
  
  // Analytics aggregées
  analytics: {
    totalSessions: number;
    totalAnalyses: number;
    averageSessionDuration: number;
    mostFrequentEmotion: EmotionLabel;
    emotionDistribution: Record<EmotionLabel, number>;
    overallWellbeingScore: number; // 0-100
    stabilityTrend: 'improving' | 'stable' | 'declining';
    confidenceScore: number;
    
    // Patterns temporels
    timePatterns: {
      hourlyDistribution: Record<number, number>;
      weeklyDistribution: Record<number, number>;
      seasonalTrends?: Record<string, number>;
    };
    
    // Corrélations
    correlations: Array<{
      factor: string;
      strength: number;
      description: string;
    }>;
  };
  
  // Métadonnées
  exportVersion: string;
  dataQuality: number;
  privacyLevel: 'full' | 'anonymized' | 'aggregated';
}