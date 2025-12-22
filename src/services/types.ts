// Types communs pour les services EmotionsCare

export interface EmotionData {
  emotion: string;
  confidence: number;
  intensity: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface MusicRecommendation {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  energy: number;
  valence: number;
  url?: string;
  duration?: number;
}

export interface TherapeuticSession {
  id: string;
  userId: string;
  type: 'music' | 'breathing' | 'meditation' | 'coaching';
  startTime: Date;
  endTime?: Date;
  emotions: EmotionData[];
  recommendations: MusicRecommendation[];
  outcome?: {
    moodImprovement: number;
    stressReduction: number;
    satisfaction: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ServiceConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
}