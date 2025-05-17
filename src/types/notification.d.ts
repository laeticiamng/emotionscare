
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'custom';
export type NotificationTone = 'professional' | 'friendly' | 'minimal';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  frequency: NotificationFrequency;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement: boolean;
    badge: boolean;
    challenge: boolean;
    reminder: boolean;
    info: boolean;
    warning: boolean;
    error: boolean;
    success: boolean;
    streak: boolean;
    urgent: boolean;
  };
}
