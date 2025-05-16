
import { Notification, NotificationFilter, NotificationType } from '@/types/notification';

export const filterNotifications = (
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] => {
  if (!notifications || notifications.length === 0) {
    return [];
  }

  if (filter === 'all') {
    return notifications;
  }
  
  if (filter === 'unread') {
    return notifications.filter(notification => !notification.read);
  }
  
  // Handle notification types (emotion, journal, etc.)
  return notifications.filter(notification => notification.type === filter as NotificationType);
};

export const getUnreadCount = (notifications: Notification[]): number => {
  if (!notifications) return 0;
  return notifications.filter(notification => !notification.read).length;
};
