
export interface CoachMessage {
  id: string;
  conversation_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type CoachEvent = {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
};

export type CoachAction = {
  id: string;
  type: string;
  payload: any;
  created_at?: string;
};

export type EmotionalData = {
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
};

export type EmotionalTrend = {
  trend: 'improving' | 'declining' | 'stable';
  period: 'day' | 'week' | 'month';
  startDate: Date;
  endDate: Date;
  emotions: EmotionalData[];
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
  },
  scan: {
    model: 'gpt-4o-mini',
    temperature: 0.4,
    max_tokens: 800,
    top_p: 1,
    stream: false,
    cacheEnabled: true,
    cacheTTL: 1800
  }
};
