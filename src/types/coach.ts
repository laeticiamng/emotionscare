
export interface CoachMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'question' | 'suggestion' | 'info';
  isBot: boolean;
}

export interface CoachEvent {
  id: string;
  type: 'session' | 'emotion' | 'achievement' | 'milestone';
  date: string;
  title: string;
  description: string;
}

export interface CoachAction {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  completed: boolean;
  due?: string;
}

export interface EmotionalData {
  emotion: string;
  intensity: number;
  date: string;
}

export interface EmotionalTrend {
  trend: 'improving' | 'declining' | 'stable';
  primaryEmotion: string;
  secondaryEmotion?: string;
  startDate: string;
  endDate: string;
  data: EmotionalData[];
}

export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'suggestion' | 'achievement';
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}
