
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
      return notifications.filter(notification => notification.priority === 'urgent');
    case 'system':
      return notifications.filter(notification => notification.type === 'system');
    case 'journal':
      return notifications.filter(notification => notification.type === 'journal');
    case 'emotion':
      return notifications.filter(notification => notification.type === 'emotion');
    case 'user':
      return notifications.filter(notification => notification.type === 'user');
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
    case 'user':
      return 'Utilisateur';
    default:
      return 'Toutes';
  }
};
