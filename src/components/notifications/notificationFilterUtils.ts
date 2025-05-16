
import { Notification, NotificationFilter } from '@/types/notification';

/**
 * Filter notifications based on the selected filter
 */
export const filterNotifications = (
  notifications: Notification[],
  filter: NotificationFilter
): Notification[] => {
  switch (filter) {
    case 'all':
      return notifications;
    case 'unread':
      return notifications.filter(notification => !notification.read);
    case 'read':
      return notifications.filter(notification => notification.read);
    case 'urgent':
      return notifications.filter(notification => 
        notification.type === 'urgent' || notification.priority === 'urgent');
    case 'system':
    case 'emotion':
    case 'journal':
    case 'community':
      return notifications.filter(notification => notification.type === filter);
    default:
      return notifications;
  }
};

/**
 * Get filter label for display
 */
export const getFilterLabel = (filter: NotificationFilter): string => {
  switch (filter) {
    case 'all':
      return 'Toutes';
    case 'unread':
      return 'Non lues';
    case 'read':
      return 'Lues';
    case 'urgent':
      return 'Urgentes';
    case 'system':
      return 'Système';
    case 'journal':
      return 'Journal';
    case 'emotion':
      return 'Émotions';
    case 'community':
      return 'Communauté';
    default:
      return 'Toutes';
  }
};
