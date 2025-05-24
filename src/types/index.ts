
export type UserModeType = 'b2c' | 'b2b_user' | 'b2b_admin' | 'personal';

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
}

export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
  genre?: string;
}
