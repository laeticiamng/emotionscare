
import { useState, useEffect } from 'react';

export interface NotificationBadgeState {
  count: number;
  unreadCount: number;
  clearBadge: () => void;
}

export function useNotificationBadge(): NotificationBadgeState {
  const [count, setCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Simulate loading notifications
  useEffect(() => {
    // In a real app, this would fetch from an API
    const notificationCount = parseInt(localStorage.getItem('notificationCount') || '0');
    setCount(notificationCount);
    setUnreadCount(notificationCount);
  }, []);
  
  const clearBadge = () => {
    setCount(0);
    setUnreadCount(0);
    localStorage.setItem('notificationCount', '0');
  };
  
  return { count, unreadCount, clearBadge };
}
