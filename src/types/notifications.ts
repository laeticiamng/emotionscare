
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

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /**
   * Optional rich content field used by some hooks
   */
  content?: string;
  /**
   * Date of creation. Some parts of the code still reference `date`
   * instead of `timestamp` or `createdAt`.
   */
  date?: string;
  /**
   * Creation timestamp. Accepts both string and Date for flexibility.
   */
  timestamp: string | Date;
  /**
   * Indicates whether the notification has been read. `isRead` is kept for
   * backward compatibility with some hooks.
   */
  read: boolean;
  isRead?: boolean;
  /**
   * Optional navigation link associated with the notification.
   */
  linkTo?: string;
  action?: {
    label: string;
    url: string;
  };
  icon?: string;
  imageUrl?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  source?: 'system' | 'user' | 'application';
  created_at?: string;  // Added missing property
  createdAt?: string;   // Added missing property
}
