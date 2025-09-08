/**
 * 🏗️ TYPES UNIFIÉS DE PLATEFORME
 * Architecture de types centralisée pour remplacer tous les types fragmentés
 */

// Réexport des types émotionnels unifiés
export * from './unified-emotions';

// === TYPES DE CONFIGURATION ===

export interface PlatformConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  features: {
    emotionAnalysis: boolean;
    musicTherapy: boolean;
    voiceAnalysis: boolean;
    facialAnalysis: boolean;
    vrExperience: boolean;
    teamFeatures: boolean;
    premiumFeatures: boolean;
  };
  thirdParty: {
    hume: {
      enabled: boolean;
      apiKey?: string;
    };
    openai: {
      enabled: boolean;
      apiKey?: string;
    };
    suno: {
      enabled: boolean;
      apiKey?: string;
    };
  };
}

// === TYPES D'UTILISATEUR ===

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'consumer' | 'employee' | 'manager' | 'admin';
  subscription: 'free' | 'premium' | 'enterprise';
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserPreferences {
  // Interface
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'es' | 'de';
  
  // Accessibilité
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    dyslexicFont: boolean;
    fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  };
  
  // Analyses
  defaultAnalysisMode: 'quick' | 'detailed' | 'realtime';
  enabledSources: ('hume_face' | 'hume_voice' | 'openai_text' | 'biometric')[];
  
  // Musique
  musicPreferences: {
    defaultStyle: string;
    preferInstrumental: boolean;
    autoplay: boolean;
    volume: number;
  };
  
  // Notifications
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
    insights: boolean;
  };
  
  // Confidentialité
  privacy: {
    shareAnonymizedData: boolean;
    allowResearch: boolean;
    dataRetentionDays: number;
  };
}

// === TYPES DE SESSION ===

export interface WellnessSession {
  id: string;
  userId: string;
  type: 'emotion_scan' | 'music_therapy' | 'combined' | 'team_session';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Temps
  startTime: Date;
  endTime?: Date;
  plannedDuration: number; // minutes
  actualDuration?: number; // minutes
  
  // Configuration
  config: {
    goal: 'relax' | 'energize' | 'focus' | 'mood_boost' | 'sleep' | 'anxiety_relief' | 'custom';
    intensity: 'low' | 'medium' | 'high';
    sources: ('hume_face' | 'hume_voice' | 'openai_text' | 'biometric')[];
  };
  
  // Résultats
  results?: {
    initialEmotion: string;
    finalEmotion?: string;
    emotionJourney: Array<{
      timestamp: Date;
      emotion: string;
      confidence: number;
    }>;
    recommendations: Array<{
      type: string;
      title: string;
      completed: boolean;
    }>;
    userFeedback?: {
      rating: number; // 1-5
      comment?: string;
    };
  };
  
  // Métadonnées
  metadata: {
    device: 'mobile' | 'desktop' | 'tablet' | 'vr';
    location?: string;
    weather?: string;
    context?: string;
  };
}

// === TYPES D'ANALYTICS ===

export interface PlatformAnalytics {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Métriques générales
  overview: {
    totalSessions: number;
    totalDuration: number; // minutes
    averageSessionDuration: number;
    completionRate: number; // 0-100
    streakDays: number;
    wellbeingScore: number; // 0-100
  };
  
  // Analyse émotionnelle
  emotions: {
    distribution: Record<string, number>; // émotion -> pourcentage
    dominantEmotion: string;
    emotionTrends: Array<{
      date: Date;
      emotion: string;
      intensity: number;
    }>;
    stabilityScore: number; // 0-100
  };
  
  // Utilisation musique
  music: {
    totalListeningTime: number; // minutes
    favoriteGenres: Record<string, number>;
    mostEffectiveTracks: Array<{
      trackId: string;
      effectiveness: number;
      plays: number;
    }>;
    therapyGoalsAchieved: number;
  };
  
  // Patterns temporels
  patterns: {
    bestTimeOfDay: string;
    mostActiveDay: string;
    sessionFrequency: 'daily' | 'weekly' | 'irregular';
    improvementAreas: string[];
  };
  
  // Recommandations
  insights: Array<{
    type: 'pattern' | 'recommendation' | 'milestone' | 'warning';
    title: string;
    description: string;
    actionable: boolean;
    priority: 'low' | 'medium' | 'high';
  }>;
}

// === TYPES D'ÉQUIPE (Enterprise) ===

export interface TeamAnalytics {
  teamId: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Vue d'ensemble équipe
  overview: {
    memberCount: number;
    activeMembers: number;
    averageWellbeingScore: number;
    teamMorale: 'low' | 'medium' | 'high';
    riskLevel: 'low' | 'medium' | 'high';
  };
  
  // Distribution émotionnelle
  emotionalDistribution: {
    positive: number; // pourcentage
    neutral: number;
    negative: number;
    trends: Array<{
      date: Date;
      positiveRatio: number;
    }>;
  };
  
  // Analyse par département
  departments: Record<string, {
    memberCount: number;
    averageWellbeing: number;
    riskFactors: string[];
  }>;
  
  // Alertes et recommandations
  alerts: Array<{
    level: 'info' | 'warning' | 'critical';
    type: 'individual' | 'department' | 'team';
    message: string;
    actionRequired: boolean;
  }>;
  
  // Recommandations RH
  hrRecommendations: Array<{
    category: 'workload' | 'environment' | 'communication' | 'support';
    priority: 'low' | 'medium' | 'high';
    suggestion: string;
    expectedImpact: string;
  }>;
}

// === TYPES D'API ===

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: Date;
    duration: number;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: Date;
}

// === TYPES DE NOTIFICATION ===

export interface PlatformNotification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  category: 'system' | 'wellness' | 'social' | 'achievement' | 'reminder';
  
  // Contenu
  title: string;
  message: string;
  description?: string;
  
  // Actions
  actions?: Array<{
    label: string;
    type: 'primary' | 'secondary';
    action: string;
  }>;
  
  // État
  read: boolean;
  archived: boolean;
  
  // Timing
  createdAt: Date;
  scheduledFor?: Date;
  expiresAt?: Date;
  
  // Métadonnées
  metadata?: {
    source: string;
    priority: 'low' | 'medium' | 'high';
    persistent: boolean;
  };
}

// === TYPES D'EXPORT ===

export interface DataExportRequest {
  userId: string;
  format: 'json' | 'csv' | 'pdf';
  scope: 'personal' | 'team' | 'organization';
  period: {
    start: Date;
    end: Date;
  };
  includeRawData: boolean;
  anonymized: boolean;
}

export interface DataExportResult {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
  fileSize?: number;
  error?: string;
}

// === TYPES DE GAMIFICATION ===

export interface Achievement {
  id: string;
  category: 'wellness' | 'consistency' | 'improvement' | 'social' | 'milestone';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  criteria: {
    type: string;
    threshold: number;
    timeframe?: string;
  };
  unlockedAt?: Date;
}

export interface UserProgress {
  userId: string;
  level: number;
  experience: number;
  nextLevelXP: number;
  streak: {
    current: number;
    longest: number;
  };
  achievements: Achievement[];
  badges: string[];
  leaderboardRank?: number;
}

// === EXPORT GLOBAL ===

export type EmotionsCareUser = UserProfile;
export type EmotionsCareSession = WellnessSession;
export type EmotionsCareAnalytics = PlatformAnalytics;