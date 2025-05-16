
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
  const isValidType = [
    'emotion', 'journal', 'community', 'achievement', 'reminder', 
    'system', 'success', 'warning', 'error', 'alert', 'message'
  ].includes(filter as string);

  if (isValidType) {
    return notifications.filter(notification => notification.type === filter as NotificationType);
  }

  // Default: return all notifications
  return notifications;
};
