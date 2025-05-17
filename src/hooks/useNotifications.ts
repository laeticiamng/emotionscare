
import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationFilter } from '@/types/notification';
import { v4 as uuid } from 'uuid';

interface UseNotificationsOptions {
  userId?: string;
  fetchOnMount?: boolean;
  limit?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { userId, fetchOnMount = true, limit = 20 } = options;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock implementation, would be replaced with real API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockNotifications: Notification[] = Array.from({ length: limit }, (_, i) => ({
        id: `notif-${i}`,
        user_id: userId || 'current-user',
        title: `Notification ${i}`,
        message: `This is notification message ${i}`,
        type: i % 5 === 0 ? 'system' : 
              i % 4 === 0 ? 'emotion' :
              i % 3 === 0 ? 'journal' :
              i % 2 === 0 ? 'achievement' : 'info',
        read: i % 3 === 0,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        created_at: new Date(Date.now() - i * 3600000).toISOString()
      }));
      
      setNotifications(mockNotifications);
      
      // Count unread notifications
      const unread = mockNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      return mockNotifications;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit]);
  
  const fetchUnreadCount = useCallback(async () => {
    try {
      // Mock implementation
      const count = notifications.filter(n => !n.read).length;
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return 0;
    }
  }, [notifications]);
  
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      
      // Update unread count
      fetchUnreadCount();
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, [fetchUnreadCount]);
  
  const markAllAsRead = useCallback(async () => {
    try {
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, []);
  
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      // Generate a new notification with required fields
      const newNotification: Notification = {
        id: uuid(),
        ...notification,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString(),
        read: false
      };
      
      // Update local state
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      return newNotification.id;
    } catch (err) {
      console.error('Error adding notification:', err);
      throw err;
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    if (fetchOnMount) {
      fetchNotifications();
    }
  }, [fetchOnMount, fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };
};

export default useNotifications;
