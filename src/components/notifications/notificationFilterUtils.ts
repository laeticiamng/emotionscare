
import { Notification, NotificationFilter } from '@/types/notification';

export const filterNotifications = (
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] => {
  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.read);
    case 'achievement':
    case 'badge':
    case 'reminder':
    case 'streak':
    case 'info':
    case 'success':
    case 'warning':
    case 'error':
      return notifications.filter(n => n.type === filter);
    case 'all':
    default:
      return notifications;
  }
};
