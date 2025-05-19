
export type NotificationFrequency = 'immediate' | 'daily' | 'weekly' | 'never';
export type NotificationTone = 'formal' | 'friendly' | 'casual' | 'professional';

export interface NotificationPreference {
  enabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  push?: boolean;
  inApp?: boolean;
  frequency?: NotificationFrequency;
  channels?: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  types?: {
    system?: boolean;
    emotion?: boolean;
    badge?: boolean;
    challenge?: boolean;
    message?: boolean;
    update?: boolean;
    mention?: boolean;
    team?: boolean;
    report?: boolean;
    reminder?: boolean;
    activity?: boolean;
    alert?: boolean;
    important?: boolean;
    urgent?: boolean;
    coach?: boolean;
    journal?: boolean;
    community?: boolean;
  };
  category?: string;
  type?: string;
  id?: string;
  userId?: string;
}

export interface Notification {
  id: string;
  title: string;
  /**
   * Main text of the notification. `message` can also be used by some
   * components so both are kept.
   */
  content?: string;
  message?: string;
  read: boolean;
  /**
   * Some hooks use `isRead` instead of `read`.
   */
  isRead?: boolean;
  type: string;
  createdAt: string;
  created_at?: string;
  timestamp?: string;
  /**
   * Alternative date field used in older components.
   */
  date?: string;
  userId?: string;
  icon?: string;
  action?: string;
  actionUrl?: string;
  /**
   * Optional navigation target.
   */
  linkTo?: string;
  category?: string;
}

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

export type NotificationFilter =
  | 'all'
  | 'unread'
  | 'read'
  | NotificationType;
