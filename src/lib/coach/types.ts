
// Types for the Coach service
export interface CoachEvent {
  type: 'scan_completed' | 'predictive_alert' | 'daily_reminder';
  user_id: string;
  data?: any;
}

export interface CoachAction {
  type: string;
  payload?: any;
}

export interface CoachRoutine {
  name: string;
  description: string;
  trigger: string;
  actions: CoachAction[];
  priority: number; // Priorité de la routine (plus élevée = plus importante)
}

export interface CoachNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: Date;
}

export interface UserEmotionalData {
  lastEmotions: Array<{ emotion: string, timestamp: Date, confidence: number }>;
  averageScore: number;
  trends: { [key: string]: number };
}
