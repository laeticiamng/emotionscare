
export type NotificationFrequency = 
  | "immediate"
  | "daily"
  | "weekly";

export type NotificationType = 
  | "system"
  | "emotion"
  | "coach"
  | "journal"
  | "community"
  | "achievement"
  | "badge"; 

export type NotificationTone = 
  | "friendly"
  | "professional" 
  | "direct"
  | "motivational"; 

export interface NotificationPreference {
  enabled: boolean;
  frequency: NotificationFrequency;
  types: Record<NotificationType, boolean>;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  tone?: NotificationTone;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}
