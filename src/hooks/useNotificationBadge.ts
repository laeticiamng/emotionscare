
import { useState, useEffect } from 'react';
import { NotificationService } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

export function useNotificationBadge() {
  const [count, setCount] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.id) return;
    
    // Load initial count
    const loadNotifications = async () => {
      try {
        const unreadCount = await NotificationService.getUnreadCount();
        setCount(unreadCount);
      } catch (error) {
        console.error('Error loading notification count:', error);
      }
    };
    
    loadNotifications();
    
    // Subscribe to notification updates if available
    const unsubscribe = NotificationService.subscribeToNotifications?.(() => {
      loadNotifications();
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);
  
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  return { count, markAllAsRead };
}
