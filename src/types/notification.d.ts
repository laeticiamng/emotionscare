
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'custom';

export type NotificationTone = 'formal' | 'casual' | 'friendly' | 'professional';

export interface NotificationPreference {
  enabled: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
  frequency: NotificationFrequency;
  types?: Record<string, boolean>;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
