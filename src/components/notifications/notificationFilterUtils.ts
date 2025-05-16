
import { Notification, NotificationFilter, NotificationType } from "@/types/notification";

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

  // Type-specific filtering
  const validTypes: NotificationType[] = [
    'emotion', 'journal', 'community', 'achievement', 'reminder', 
    'system', 'success', 'warning', 'error', 'alert', 'message'
  ];
  
  if (validTypes.includes(filter as NotificationType)) {
    return notifications.filter(notification => notification.type === filter);
  }

  // Default: return all notifications
  return notifications;
};
