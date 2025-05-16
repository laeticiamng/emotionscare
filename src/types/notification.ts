
export type NotificationFrequency = 'realtime' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'friendly' | 'professional' | 'direct' | 'calm';

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  frequency: NotificationFrequency;
  tone?: NotificationTone;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
  };
}
