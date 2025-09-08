
/**
 * 📝 TYPES EXPORTS
 * Point d'entrée unifié pour tous les types
 */

// Core types
export * from './coach';
export * from './emotion';

// Unified types
export * from './unified-emotions';

// Types globaux de l'application
export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  premium: boolean;
  enabled: boolean;
  category: 'emotion' | 'analytics' | 'wellness' | 'social';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface EmotionData {
  id: string;
  user_id: string;
  emotion_type: 'joy' | 'calm' | 'energy' | 'focus' | 'stress' | 'neutral';
  intensity: number; // 1-10
  source: 'voice' | 'text' | 'camera' | 'manual';
  metadata?: Record<string, any>;
  created_at: string;
}
