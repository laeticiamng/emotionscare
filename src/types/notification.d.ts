
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
  | "badge"; // Ajout du type "badge"

export type NotificationTone = 
  | "friendly"
  | "professional" 
  | "direct"
  | "motivational"; // Ajout des valeurs manquantes

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
