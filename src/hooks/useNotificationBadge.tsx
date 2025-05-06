
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/lib/coach/notification-service';

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.id) return;
    
    // Get initial count
    const initialCount = notificationService.getUnreadCount(user.id);
    setUnreadCount(initialCount);
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribeToUnreadCount(
      user.id, 
      (count) => setUnreadCount(count)
    );
    
    return unsubscribe;
  }, [user?.id]);
  
  const markAsRead = (notificationId: string) => {
    if (user?.id) {
      notificationService.markAsRead(user.id, notificationId);
    }
  };
  
  const markAllAsRead = () => {
    if (user?.id) {
      notificationService.markAllAsRead(user.id);
    }
  };
  
  return {
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}
