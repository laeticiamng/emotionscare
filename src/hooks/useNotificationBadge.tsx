
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/lib/coach/notification-service';

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user?.id) return;
    
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribeToUnreadCount(
      user.id, 
      (count) => setUnreadCount(count)
    );
    
    return unsubscribe;
  }, [user?.id]);
  
  return {
    unreadCount,
    markAsRead: (notificationId: string) => {
      if (user?.id) {
        notificationService.markAsRead(user.id, notificationId);
      }
    },
    markAllAsRead: () => {
      if (user?.id) {
        notificationService.markAllAsRead(user.id);
      }
    }
  };
}
