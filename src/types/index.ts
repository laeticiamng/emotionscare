
// Re-export all types from specific modules
export * from './chat';
export * from './emotions';
export * from './music';
export * from './user';
export * from './theme';

// Core application types
export interface User {
  id: string;
  email: string;
  role: 'b2c' | 'b2b_user' | 'b2b_admin';
  name?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmotionResult {
  id: string;
  userId: string;
  timestamp: Date;
  overallMood: string;
  emotions: Array<{
    emotion: string;
    confidence: number;
    intensity: number;
  }>;
  dominantEmotion: string;
  confidence: number;
  source: 'text' | 'voice' | 'image';
  recommendations: string[];
  metadata?: Record<string, any>;
  // Legacy fields for compatibility
  emotion?: string;
  text?: string;
  score?: number;
  date?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  message?: string;
}
