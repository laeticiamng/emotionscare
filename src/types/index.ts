// @ts-nocheck
/**
 * TYPES UNIFIÉS EMOTIONSCARE - PLATEFORME PREMIUM
 * Consolidation et optimisation de tous les types pour éviter la duplication
 */

// === TYPES D'ÉMOTIONS UNIFIÉS ===
export type EmotionCategory = 'positive' | 'negative' | 'neutral' | 'mixed' | 'intense';
export type EmotionSource = 'facial_analysis' | 'voice_analysis' | 'text_analysis' | 'multimodal' | 'biometric';
export type ScanMode = 'facial' | 'voice' | 'text' | 'combined' | 'realtime';

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
  temporal?: number;
}

// === RÉSULTAT D'ANALYSE ÉMOTIONNELLE UNIFIÉ ===
export interface EmotionResult {
  id: string;
  userId?: string;
  user_id?: string; // Compatibilité DB
  timestamp: string | Date;
  date?: string | Date; // Compatibilité DB
  
  // Données principales
  emotion: string;
  confidence: number | EmotionConfidence;
  intensity: number;
  source: EmotionSource;
  scanMode?: ScanMode;
  
  // Données supplémentaires
  text?: string;
  transcription?: string;
  feedback?: string;
  ai_feedback?: string; // Compatibilité DB
  emojis?: string[] | string;
  score?: number; // Compatibilité DB
  
  // Données avancées
  vector?: EmotionVector;
  biometrics?: BiometricData;
  rawData?: any;
  details?: Record<string, any>;
  
  // URLs de médias
  audioUrl?: string;
  audio_url?: string; // Compatibilité DB
  imageUrl?: string;
  
  // Métadonnées
  duration?: number;
  sessionId?: string;
  environment?: 'home' | 'office' | 'outdoor' | 'public';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  
  // Prédictions et recommandations
  predictions?: {
    nextEmotionLikely?: string;
    stabilityScore?: number;
    recommendedActions?: string[];
  };
  recommendations?: string[];
}

// === TYPES MUSIQUE UNIFIÉS ===
export interface MusicTrack {
  id: string;
  title: string;
  artist?: string;
  duration: number; // en secondes
  url: string;
  coverUrl?: string;
  emotion: string;
  genre?: string;
  bpm?: number;
  energy?: number; // 0-1
  valence?: number; // 0-1 (negative to positive)
  tags?: string[];
  createdAt?: Date;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  emotion: string;
  mood?: string;
  coverUrl?: string;
  duration?: number;
  createdAt?: Date;
  userId?: string;
}

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  currentIndex: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

// === TYPES MOOD/HUMEUR UNIFIÉS ===
export interface MoodData {
  id: string;
  userId: string;
  date: string | Date;
  mood: number;
  energy?: number;
  anxiety?: number;
  notes?: string;
  tags?: string[];
  sentiment?: string;
  emotions?: Record<string, number>;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// === RECOMMANDATIONS UNIFIÉES ===
export interface EmotionRecommendation {
  id: string;
  type: 'activity' | 'music' | 'breathing' | 'meditation' | 'social' | 'environment' | 'journal';
  title: string;
  description: string;
  emotion: string;
  content: string;
  category: 'mindfulness' | 'music' | 'physical' | 'social' | 'reflection' | 'creative';
  
  // Métadonnées
  duration?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  effectiveness?: number;
  personalizedScore?: number;
  
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

// === CONFIGURATIONS ET PARAMÈTRES ===
export interface EmotionAnalysisConfig {
  duration: number;
  sensitivity: number;
  sources: ScanMode[];
  realTimeUpdates?: boolean;
  biometricTracking?: boolean;
  environmentalContext?: boolean;
  confidenceThreshold?: number;
  noiseReduction?: boolean;
  smoothingFactor?: number;
  personalizedAlgorithms?: boolean;
  historicalContext?: boolean;
  predictiveMode?: boolean;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  preferences?: {
    genre?: string[];
    tempo?: 'slow' | 'medium' | 'fast';
    instrumental?: boolean;
    language?: string;
  };
}

// === SESSIONS ET ANALYTICS ===
export interface ScanSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  results: EmotionResult[];
  config: EmotionAnalysisConfig;
  averageConfidence: number;
  dominantEmotion: string;
  emotionChanges: number;
  stabilityScore: number;
  location?: string;
  device?: string;
  appVersion?: string;
  notes?: string;
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

// === INSIGHTS ET PATTERNS ===
export interface EmotionInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'prediction' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidenceData?: any;
  relatedResults?: string[];
  suggestions?: EmotionRecommendation[];
  createdAt: Date;
  expiresAt?: Date;
  acknowledged?: boolean;
  actionTaken?: string;
}

// === EXPORT ET ANALYSE ===
export interface EmotionDataExport {
  userId: string;
  exportDate: Date;
  dateRange: { start: Date; end: Date };
  sessions: ScanSession[];
  trends: EmotionTrend[];
  insights: EmotionInsight[];
  analytics: {
    totalScans: number;
    averageSessionDuration: number;
    mostFrequentEmotion: string;
    emotionDiversity: number;
    overallWellbeingScore: number;
  };
}

// === ACCESSIBILITÉ ===
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  subtitles: boolean;
}

// === TYPES D'ERREUR ===
export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// === STATUT DE CHARGEMENT ===
export interface LoadingState {
  isLoading: boolean;
  error?: APIError | null;
  lastUpdated?: Date;
}

// Réexportation pour compatibilité ascendante
export type { MusicTrack as Track };
export type { MusicPlaylist as Playlist };
export type { EmotionResult as Emotion };

// Export des types de widgets et dashboard
export * from './kpi';
export * from './dashboard';
export * from './segment';
export * from './onboarding';
export * from './widgets';