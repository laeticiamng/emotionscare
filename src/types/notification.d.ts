
export type NotificationFrequency =
  | "immediately"
  | "daily"
  | "weekly"
  | "never";

export type NotificationTone =
  | "friendly" 
  | "professional"
  | "direct"
  | "motivational";

export type NotificationType =
  | "alert"
  | "reminder"
  | "update"
  | "message"
  | "badge"
  | "achievement"
  | "health";

export interface NotificationPreference {
  type: NotificationType;
  frequency: NotificationFrequency;
  tone: NotificationTone;
  enabled: boolean;
}
