
export type CoachEvent = {
  type: 'scan_completed' | 'predictive_alert' | 'daily_reminder' | 'api_check';
  user_id: string;
  data?: any;
};

export type CoachAction = {
  type: string;
  payload?: any;
};

// Update notification type for coach service to include title and support more notification types
export type CoachNotification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'system' | 'invitation' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  link?: string;
};

// Add additional types for coach service
export type EmotionalData = {
  emotion?: string;
  emojis?: string;
  score?: number;
  date?: string;
  intensity?: number;
  feedback?: string;
};

export type AIModelParams = {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
};

export type CoachModule = 'chat' | 'coach' | 'journal' | 'buddy' | 'scan';

// Config for different AI models based on module
export const AI_MODEL_CONFIG: Record<CoachModule, AIModelParams> = {
  chat: {
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.2,
    max_tokens: 256,
    top_p: 1.0,
    stream: false
  },
  coach: {
    model: "gpt-4.1-2025-04-14",
    temperature: 0.4,
    max_tokens: 512,
    top_p: 1.0,
    stream: true
  },
  journal: {
    model: "gpt-4.1-2025-04-14",
    temperature: 0.3,
    max_tokens: 1024,
    top_p: 1.0,
    stream: false
  },
  buddy: {
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.5,
    max_tokens: 256,
    top_p: 1.0,
    stream: false
  },
  scan: {
    model: "gpt-4o-mini-2024-07-18",
    temperature: 0.2,
    max_tokens: 128,
    top_p: 1.0,
    stream: false
  }
};
