
import { useState, useCallback } from 'react';
import { Notification, NotificationFilter } from '@/types';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  filter: NotificationFilter;
  setFilter: (filter: NotificationFilter) => void;
  fetchNotifications: (selectedFilter?: NotificationFilter) => Promise<Notification[]>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>('all');

  const fetchNotifications = useCallback(
    async (selectedFilter: NotificationFilter = filter): Promise<Notification[]> => {
      setIsLoading(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'New Feature Available',
            message: 'Check out our new emotional analysis tool!',
            type: 'info',
            timestamp: new Date(),
            read: false,
            actionUrl: '/features/new',
            actionLabel: 'Explore'
          },
          {
            id: '2',
            title: 'Weekly Report',
            message: 'Your emotional wellbeing report is ready.',
            type: 'success',
            timestamp: new Date(Date.now() - 86400000),
            read: true,
            actionUrl: '/reports',
            actionLabel: 'View Report'
          },
          {
            id: '3',
            title: 'Reminder',
            message: 'Don\'t forget your emotional check-in today.',
            type: 'reminder',
            timestamp: new Date(Date.now() - 172800000),
            read: false
          }
        ];
        
        // Filter notifications
        let filteredNotifications = [...mockNotifications];
        if (selectedFilter === 'unread') {
          filteredNotifications = filteredNotifications.filter(n => !n.read);
        } else if (selectedFilter !== 'all') {
          filteredNotifications = filteredNotifications.filter(n => n.type === selectedFilter);
        }
        
        setNotifications(filteredNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        
        return filteredNotifications;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [filter]
  );
  
  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }, []);
  
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }, []);
  
  const deleteNotification = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const notificationToRemove = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (notificationToRemove && !notificationToRemove.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }, [notifications]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};

export type { Notification, NotificationFilter };
