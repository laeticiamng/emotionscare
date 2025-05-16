
export * from './user';
export * from './theme';
export * from './music';
export * from './gamification';
export * from './emotions';
export * from './auth';

export interface EmotionResult {
  emotion: string;
  confidence?: number;
  timestamp?: Date | string;
  id?: string;
  source?: 'text' | 'voice' | 'face' | 'manual';
}
