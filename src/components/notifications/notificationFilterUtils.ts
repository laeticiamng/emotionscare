
import { Notification, NotificationFilter, NotificationType } from '@/types/notification';

// A utility function that filters notifications based on the active filter
export const filterNotifications = (
  notifications: Notification[], 
  activeFilter: NotificationFilter
): Notification[] => {
  if (!notifications) return [];
  
  switch (activeFilter) {
    case 'all':
      return notifications;
      
    case 'read':
      return notifications.filter(notification => notification.read);
      
    case 'unread':
      return notifications.filter(notification => !notification.read);
      
    case 'urgent':
      return notifications.filter(notification => notification.priority === 'urgent');
      
    // Handle filter by notification type  
    case 'system':
    case 'emotion':
    case 'coach':
    case 'journal':
    case 'community':
    case 'user':
    case 'message':
      return notifications.filter(notification => notification.type === activeFilter);
      
    default:
      return notifications;
  }
};

// Get count of unread notifications filtered by type if specified
export const getUnreadCount = (
  notifications: Notification[], 
  filter?: NotificationFilter
): number => {
  if (!notifications) return 0;
  
  if (filter) {
    if (filter === 'urgent') {
      return notifications.filter(n => !n.read && n.priority === 'urgent').length;
    }
    
    if (filter === 'unread') {
      return notifications.filter(n => !n.read).length;
    }
    
    if (filter === 'read') {
      return notifications.filter(n => n.read).length;
    }
    
    // Filter by specific type
    if (filter !== 'all') {
      return notifications.filter(n => !n.read && n.type === filter).length;
    }
  }
  
  // Default: all unread
  return notifications.filter(n => !n.read).length;
};

// Get notification filters with counts for UI display
export const getNotificationFiltersWithCounts = (
  notifications: Notification[]
): { id: NotificationFilter; label: string; count: number }[] => {
  return [
    { id: 'all', label: 'Toutes', count: notifications.length },
    { id: 'unread', label: 'Non lues', count: getUnreadCount(notifications, 'unread') },
    { id: 'system', label: 'Système', count: getUnreadCount(notifications, 'system') },
    { id: 'emotion', label: 'Émotions', count: getUnreadCount(notifications, 'emotion') },
    { id: 'coach', label: 'Coach', count: getUnreadCount(notifications, 'coach') },
    { id: 'urgent', label: 'Urgentes', count: getUnreadCount(notifications, 'urgent') },
  ];
};
