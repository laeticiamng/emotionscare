
// Point 5: Services API Foundation - Types TypeScript stricts

// Types de base pour les réponses API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
  error?: string;
}

// Types pour la configuration des requêtes
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, string>;
  timeout?: number;
}

// Types pour les intercepteurs
export type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig>;
export type ErrorInterceptor = (error: any) => Promise<void>;

// Types pour l'analyse d'émotion
export interface EmotionAnalysisResult {
  text: string;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  dominantEmotion: string;
  confidence: number;
  timestamp: string;
  recommendations: string[];
}

// Types pour le profil utilisateur
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  preferences: {
    theme: string;
    language: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
  };
}

// Types pour les entrées de journal
export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  date: string;
  ai_feedback?: string;
}

// Types pour les activités d'utilisation d'API
export interface ApiUseActivity {
  date: string;
  openai?: number;
  whisper?: number;
  musicgen?: number;
  humeai?: number;
  dalle?: number;
}

// Types pour les statistiques d'utilisation d'API
export interface ApiUsageStats {
  totalCalls: number;
  callsByApi: {
    openai: number;
    whisper: number;
    musicgen: number;
    humeai: number;
    dalle: number;
  };
  errorRate: number;
  avgResponseTime: number;
  costEstimate: number;
  period: {
    start: string;
    end: string;
  };
}

// Types pour les événements d'API
export interface ApiEvent {
  id: string;
  timestamp: string;
  api: string;
  endpoint: string;
  success: boolean;
  responseTime: number;
  errorMessage?: string;
  userId?: string;
  cost?: number;
}

// Types pour l'état de l'API
export interface ApiStatus {
  name: string;
  isAvailable: boolean;
  lastChecked: Date | null;
}

// Types pour les erreurs API
export interface ApiError {
  status: number;
  message: string;
  data?: any;
  timestamp: string;
}
