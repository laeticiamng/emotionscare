
export type NotificationFrequency = 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'never';
export type NotificationTone = 'default' | 'success' | 'warning' | 'error' | 'info';

export type NotificationType = 
  | 'system' 
  | 'emotion' 
  | 'coach' 
  | 'journal' 
  | 'community' 
  | 'achievement' 
  | 'badge' 
  | 'challenge' 
  | 'reminder' 
  | 'info' 
  | 'warning' 
  | 'error' 
  | 'success'
  | 'streak'
  | 'urgent';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: Record<NotificationType, boolean>;
  frequency: NotificationFrequency;
}
