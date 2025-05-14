
// Notification types
export type NotificationFrequency = 'hourly' | 'daily' | 'weekly' | 'custom';
export type NotificationType = 'reminder' | 'alert' | 'achievement' | 'suggestion' | 'update';
export type NotificationTone = 'gentle' | 'neutral' | 'energetic';

// Notification interface
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  content: string;
  createdAt: string | Date;
  read: boolean; // For NotificationsPanel
  timestamp?: string | Date; // For NotificationsPanel
  action_url?: string;
  priority?: 'low' | 'medium' | 'high';
  action_label?: string;
  category?: string;
  seen?: boolean;
}

// Notification preference for user settings
export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean; // For PreferencesForm
  emailEnabled: boolean; // For PreferencesForm
  pushEnabled: boolean; // For PreferencesForm
  frequency?: NotificationFrequency;
}
