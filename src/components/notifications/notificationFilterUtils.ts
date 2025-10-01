// @ts-nocheck

import { Notification, NotificationFilter, NotificationType } from '@/types/notifications';

export const filterNotifications = (
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] => {
  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.read);
    case 'read':
      return notifications.filter(n => n.read);
    case 'achievement':
    case 'badge':
    case 'reminder':
    case 'streak':
    case 'info':
    case 'success':
    case 'warning':
    case 'error':
    case 'journal':
    case 'emotion':
    case 'system':
    case 'urgent':
      return notifications.filter(n => n.type === filter as NotificationType);
    case 'all':
    default:
      return notifications;
  }
};
