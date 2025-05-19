
// Define the types for notification preferences
export type NotificationFrequency = 'instant' | 'hourly' | 'daily' | 'weekly' | 'never' | 'immediate';
export type NotificationTone = 'informative' | 'friendly' | 'professional' | 'minimal';

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
  | 'urgent'
  | 'invitation';

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | NotificationType;

export interface NotificationPreference {
  type: string;
  enabled: boolean;
  frequency: NotificationFrequency;
  channels: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  // Backward compatibility fields
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  types?: {
    system?: boolean;
    emotion?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
    achievement?: boolean;
    badge?: boolean;
    challenge?: boolean;
    reminder?: boolean;
    info?: boolean;
    warning?: boolean;
    error?: boolean;
    success?: boolean;
    streak?: boolean;
    urgent?: boolean;
    invitation?: boolean;
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
  isRead?: boolean; // Added for backward compatibility
  created_at?: string; // For backward compatibility
  timestamp?: string | Date; // For backward compatibility
  linkTo?: string; // Added to support existing code
  date?: string; // Added to support existing code
  user_id?: string; // For backward compatibility
}
