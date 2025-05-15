
import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationFilter } from '@/types';

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New message',
    message: 'You have a new message from Alex',
    type: 'info',
    timestamp: new Date(),
    read: false,
  },
  {
    id: '2',
    title: 'Welcome to the app',
    message: 'Thanks for joining! Check out these features...',
    type: 'success',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '3',
    title: 'Reminder: Emotional check-in',
    message: 'Time for your daily emotional check-in',
    type: 'reminder',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/scan',
    actionLabel: 'Check-in now',
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 500);
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // In a real app, this would be an API call
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    // In a real app, this would be an API call
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotification = useCallback(async (id: string) => {
    // In a real app, this would be an API call
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(async () => {
    // In a real app, this would be an API call
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = useCallback(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'system':
        return notifications.filter(n => n.type === 'info' || n.type === 'warning');
      case 'alerts':
        return notifications.filter(n => n.type === 'warning' || n.type === 'error');
      default:
        return notifications;
    }
  }, [notifications, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications: filteredNotifications(),
    unreadCount,
    isLoading,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications
  };
};
