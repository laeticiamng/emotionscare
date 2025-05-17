
export type NotificationFrequency = 'daily' | 'weekly' | 'monthly' | 'never' | 'immediate';
export type NotificationTone = 'friendly' | 'neutral' | 'formal' | 'casual' | 'direct' | 'professional' | 'motivational';
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'badge' | 'streak';

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency?: NotificationFrequency;
  tone?: NotificationTone;
  time?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration?: boolean;
  dailySummary?: boolean;
  weeklyReport?: boolean;
  achievementAlerts?: boolean;
  reminderAlerts?: boolean;
  newContentAlerts?: boolean;
  emailNotifications?: boolean;
}
