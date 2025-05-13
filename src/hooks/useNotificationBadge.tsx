
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { notificationService, NotificationService } from '@/lib/coach/notification-service';

export function useNotificationBadge() {
  const [count, setCount] = useState(0);
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    
    // Initial count
    setCount(notificationService.getUnreadCount());
    
    // Setup refresh interval
    const intervalId = setInterval(() => {
      setCount(notificationService.getUnreadCount());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setCount(0);
  };
  
  return { count, markAllAsRead };
}
