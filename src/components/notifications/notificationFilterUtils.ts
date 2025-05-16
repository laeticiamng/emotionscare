
import { Notification, NotificationFilter } from '@/types';

export const filterNotifications = (
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] => {
  if (!notifications || notifications.length === 0) {
    return [];
  }

  switch (filter) {
    case 'all':
      return notifications;
    case 'unread':
      return notifications.filter(notification => !notification.read);
    case 'emotion':
    case 'journal':
    case 'community':
    case 'achievement':
    case 'reminder':
    case 'system':
    case 'success':
    case 'warning':
    case 'error':
    case 'alert':
    case 'message':
      // Filter by specific notification type
      return notifications.filter(notification => notification.type === filter);
    default:
      return notifications;
  }
};

export const getUnreadCount = (notifications: Notification[]): number => {
  if (!notifications) return 0;
  return notifications.filter(notification => !notification.read).length;
};
