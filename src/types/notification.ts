
// Define the types for notification preferences
export type NotificationFrequency = 'instant' | 'hourly' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'informative' | 'friendly' | 'professional' | 'minimal';

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency: NotificationFrequency;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

// Add Notification type for use-notifications.ts
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userId: string;
  priority?: string;
  actionLink?: string;
  actionText?: string;
  icon?: string;
  image?: string;
}
