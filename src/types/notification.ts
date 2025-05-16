
export type NotificationFrequency = "immediate" | "hourly" | "daily" | "weekly" | "never";
export type NotificationTone = "standard" | "friendly" | "professional" | "minimal";

export interface NotificationPreference {
  enabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  types: {
    system: boolean;
    emotion: boolean;
    coach: boolean;
    journal: boolean;
    community: boolean;
    achievement: boolean;
  };
  frequency: NotificationFrequency;
  email: boolean;
  push: boolean;
  sms: boolean;
  tone?: NotificationTone;
}
