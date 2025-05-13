
import { useState, useEffect } from 'react';
import { NotificationService } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0); // Renamed from count to unreadCount for consistency
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.id) return;
    
    // Load initial count
    const loadNotifications = async () => {
      try {
        const count = await NotificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading notification count:', error);
      }
    };
    
    loadNotifications();
    
    // Subscribe to notification updates if available
    const unsubscribe = NotificationService.subscribeToNotifications?.(loadNotifications);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);
  
  const markAllAsRead = async () => {
    try {
      if (!user?.id) return;
      await NotificationService.markAllAsRead(user.id);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  // Return unreadCount for consistent naming across components
  return { unreadCount, markAllAsRead, count: unreadCount };
}
