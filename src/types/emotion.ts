export interface EmotionResult {
  id?: string;
  emotion: string;
  confidence: number;
  valence?: number;
  arousal?: number;
  timestamp: Date | string;
  insight?: string;
  intensity?: number;
  suggestions?: string[];
  source?: string;
  transcription?: string;
  sentiment?: string;
  details?: any;
  // Extended fields used by various components
  score?: number;
  text?: string;
  emojis?: string | string[];
  ai_feedback?: string;
  audio_url?: string;
  date?: Date | string;
  recommendations?: (string | EmotionRecommendation)[];
  scanMode?: ScanMode;
  duration?: number;
  environment?: string;
  emotions?: Record<string, number>;
}

export interface EmotionRecommendation {
  id?: string;
  type: string;
  title: string;
  description: string;
  duration?: string;
  action?: string;
  category?: string;
  emotion?: string;
  content?: string;
}

export interface VoiceEmotionAnalyzerProps {
  onResult?: (result: EmotionResult) => void;
  onStartRecording?: () => void;
}

export interface EmotionScannerProps {
  onScanComplete: (result: EmotionResult) => void;
  isActive?: boolean;
  scanDuration?: number;
}

export interface EmotionAnalysis {
  dominantEmotion: string;
  confidence: number;
  valence: number;
  arousal: number;
  overallMood: string;
  recommendations: EmotionRecommendation[];
}

export interface EmotionalTeamViewProps {
  teamId?: string;
  data?: any[];
  period?: 'day' | 'week' | 'month' | 'year';
  anonymized?: boolean;
  dateRange?: { start: Date; end: Date };
  showGraph?: boolean;
  showMembers?: boolean;
  className?: string;
  showDetails?: boolean;
}

// Types avancés pour le scan émotionnel IA

export type ScanMode = 'text' | 'voice' | 'facial' | 'combined' | 'realtime';

export interface EmotionAnalysisConfig {
  duration: number; // Durée en secondes
  sensitivity: number; // 0-100
  sources: ScanMode[];
  realTimeUpdates: boolean;
  biometricTracking: boolean;
  confidenceThreshold?: number; // 0-100
  noiseReduction?: boolean;
  smoothingFactor?: number; // 0-1
  predictiveMode?: boolean;
}

export interface BiometricData {
  heartRate?: number; // BPM
  breathingRate?: number; // respirations par minute
  skinConductance?: number; // microsiemens
  eyeTracking?: {
    gazeDirection: { x: number; y: number };
    blinkRate: number;
    pupilDilation: number;
  };
  faceMetrics?: {
    expressionIntensity: number;
    microExpressions: string[];
    faceOrientation: {
      pitch: number;
      yaw: number;
      roll: number;
    };
  };
}

export interface EmotionConfidence {
  overall: number;
  facial?: number;
  vocal?: number;
  textual?: number;
  temporal?: number; // Confiance basée sur la cohérence temporelle
}

export interface EmotionVector {
  valence: number; // -1 (négatif) à +1 (positif)
  arousal: number; // 0 (calme) à 1 (excité)
  dominance: number; // 0 (soumis) à 1 (dominant)
}

export interface EmotionPredictions {
  nextEmotionLikely?: string;
  stabilityScore?: number; // 0-100
  recommendedActions?: string[];
  riskFactors?: string[];
}

// Extension de EmotionResult avec les nouveaux champs
export interface EmotionResultExtended extends EmotionResult {
  id?: string;
  confidence: number;
  vector?: EmotionVector;
  biometrics?: BiometricData;
  scanMode?: ScanMode;
  duration?: number; // ms
  sessionId?: string;
  rawData?: any;
  predictions?: EmotionPredictions;
  details?: {
    timeOfDay?: string;
    environment?: string;
    contextualFactors?: string[];
  };
  source_analysis?: 'text_analysis' | 'voice_analysis' | 'facial_analysis' | 'multimodal';
}