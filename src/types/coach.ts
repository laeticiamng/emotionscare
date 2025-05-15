
export interface CoachMessage {
  id: string;
  text: string;
  sender: 'user' | 'coach';
  timestamp: string;
  read?: boolean;
  attachments?: string[];
}

export interface CoachEvent {
  id: string;
  type: 'exercise' | 'reminder' | 'suggestion' | 'feedback';
  title: string;
  description: string;
  timestamp: string;
  completed?: boolean;
  due_date?: string;
}

export interface CoachAction {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'meditation' | 'journaling' | 'social' | 'other';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  completion_date?: string;
}

export interface EmotionalData {
  date: string;
  value: number;
  emotion?: string;
}

export interface EmotionalTrend {
  period: string;
  data: EmotionalData[];
  average: number;
  improvement?: number;
  insights: string[];
}

export interface CoachNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'suggestion' | 'feedback' | 'encouragement';
  timestamp: string;
  action_url?: string;
  read?: boolean;
}
