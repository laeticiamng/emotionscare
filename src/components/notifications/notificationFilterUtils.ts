
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
  // Since NotificationFilter includes NotificationType, we can use it for type filtering
  // We need to check if filter is one of our notification types
  const validTypes: NotificationType[] = [
    'emotion', 'journal', 'community', 'achievement', 'reminder', 
    'system', 'success', 'warning', 'error', 'alert', 'message'
  ];
  
  if (validTypes.includes(filter as NotificationType)) {
    return notifications.filter(notification => notification.type === filter as NotificationType);
  }

  // Default: return all notifications
  return notifications;
};
