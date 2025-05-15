
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
  id?: string;
  emotion: string;
  intensity: number;
  timestamp: Date | string;
  context?: string;
  userId?: string;
  user_id?: string;
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
