
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { notificationService, NotificationService } from '@/lib/coach/notification-service';

export function useNotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    // Initial count
    setUnreadCount(notificationService.getUnreadCount());
    
    // Setup refresh interval
    const intervalId = setInterval(() => {
      setUnreadCount(notificationService.getUnreadCount());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setUnreadCount(0);
  };
  
  return { unreadCount, markAllAsRead };
}
