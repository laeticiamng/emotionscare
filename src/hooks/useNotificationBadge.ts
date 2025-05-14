
import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationBadge } from '@/types/notification';

export function useNotificationBadge(initialCount = 0) {
  const [badge, setBadge] = useState<NotificationBadge>({
    count: initialCount,
    isRead: false
  });
  
  // Add additional counters for compatibility
  const [badgesCount, setBadgesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  
  // Increment the notification count
  const incrementCount = useCallback((amount = 1) => {
    setBadge(prev => ({
      ...prev,
      count: prev.count + amount,
      isRead: false
    }));
    setBadgesCount(prev => prev + amount);
    setNotificationsCount(prev => prev + amount);
  }, []);
  
  // Decrement the notification count, but never below 0
  const decrementCount = useCallback((amount = 1) => {
    setBadge(prev => ({
      ...prev,
      count: Math.max(0, prev.count - amount)
    }));
    setBadgesCount(prev => Math.max(0, prev - amount));
    setNotificationsCount(prev => Math.max(0, prev - amount));
  }, []);
  
  // Mark all notifications as read
  const markAsRead = useCallback(() => {
    setBadge(prev => ({
      ...prev,
      isRead: true
    }));
  }, []);
  
  // Simulate receiving notifications for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) {
        incrementCount(1);
      }
    }, 60000); // Every minute
    
    return () => clearTimeout(timer);
  }, [incrementCount]);
  
  return {
    badge,
    count: badge.count, // For direct access
    badgesCount: badge.count, // For compatibility
    notificationsCount: badge.count, // For compatibility 
    incrementCount,
    decrementCount,
    markAsRead
  };
}

export default useNotificationBadge;
