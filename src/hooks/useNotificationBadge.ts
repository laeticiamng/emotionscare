
import { useState, useEffect } from 'react';
import { notificationService } from '@/lib/coach/notification-service';
import { useAuth } from '@/hooks/useAuth';

export function useNotificationBadge() {
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  // Map the count property to unreadCount for backward compatibility
  const mappedObject = {
    count,
    unreadCount: count, // Added this line for backward compatibility
    markAllAsRead: async () => {
      if (user?.id) {
        await notificationService.markAllAsRead(user.id);
        setCount(0);
      }
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Initial count
    const fetchUnreadCount = async () => {
      const unreadCount = await notificationService.getUnreadCount(user.id);
      setCount(unreadCount);
    };
    
    fetchUnreadCount();

    // Subscribe to notifications updates
    const unsubscribe = notificationService.subscribeToNotifications(user.id, () => {
      fetchUnreadCount();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);

  return mappedObject;
}

export default useNotificationBadge;
