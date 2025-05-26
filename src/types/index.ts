
// Re-export all types for easy access
export * from './user';
export * from './userMode';
export * from './theme';
export * from './music';
export * from './emotions';
export * from './sidebar';

// Additional common types
export interface EmotionResult {
  id: string;
  emotion: string;
  confidence: number;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}
