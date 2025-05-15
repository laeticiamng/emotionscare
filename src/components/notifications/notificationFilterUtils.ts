
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
    default:
      // For specific notification types (system, emotion, etc.)
      if (typeof filter === 'string') {
        return notifications.filter(notification => notification.type === filter);
      }
      return notifications;
  }
};

export const getUnreadCount = (notifications: Notification[]): number => {
  if (!notifications) return 0;
  return notifications.filter(notification => !notification.read).length;
};
