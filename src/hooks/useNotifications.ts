
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { NotificationService } from '@/lib/notifications';

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
      const result = await NotificationService.getNotifications(userId);
      setNotifications(result.slice(0, limit));
      return result;
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
      const count = await NotificationService.getUnreadCount(userId);
      setUnreadCount(count);
      return count;
    } catch (err) {
      console.error('Error fetching unread count:', err);
      return 0;
    }
  }, [userId]);
  
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
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
      await NotificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [userId]);
  
  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    try {
      const id = await NotificationService.addNotification(notification);
      
      // Update local state
      const newNotification: Notification = {
        id,
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      return id;
    } catch (err) {
      console.error('Error adding notification:', err);
      throw err;
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    if (fetchOnMount) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchOnMount, fetchNotifications, fetchUnreadCount]);
  
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
