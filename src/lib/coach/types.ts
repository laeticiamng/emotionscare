
export interface CoachEmotionData {
  emotion: string;
  score: number;
}

export interface MusicRecommendation {
  title: string;
  genre: string;
  description: string;
}

export interface CoachServiceInterface {
  askQuestion: (question: string) => Promise<string>;
  getRecommendations: (userId: string) => Promise<string[]>;
  processEmotions: (emotions: any[]) => Promise<{
    primaryEmotion: string;
    averageScore: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  triggerCoachEvent: (
    eventType: 'scan_complete' | 'trend_change' | 'low_score' | 'reminder',
    data: any
  ) => Promise<{
    message: string;
    recommendations: string[];
  }>;
  getMusicRecommendation: (emotion: string) => Promise<MusicRecommendation>;
}

// Coach hook shared types
export type CoachAction = {
  id: string;
  type: string;
  payload: any;
  created_at?: string;
};

export type CoachEvent = {
  id: string;
  type: string;
  data: any;
  timestamp: Date | string;
};

export type EmotionalData = {
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
};

export type CoachNotification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date | string;
  read?: boolean;
  action?: CoachAction;
};

export const AI_MODEL_CONFIG = {
  chat: {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  },
  journal: {
    model: 'gpt-4o-mini',
    temperature: 0.5,
    max_tokens: 1000,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 7200
  },
  coach: {
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 500,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 3600
  }
};
