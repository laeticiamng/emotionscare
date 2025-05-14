
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface NotificationBadge {
  count: number;
  setBadgeCount: (count: number) => void;
  countUnread: () => Promise<number>;
  resetCount: () => void;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationBadge = (): NotificationBadge => {
  const [count, setCount] = useState<number>(0);
  const { user } = useAuth();

  const countUnread = async (): Promise<number> => {
    if (!user) return 0;
    
    // Mock implementation - replace with actual API call
    const mockCount = Math.floor(Math.random() * 5);
    setCount(mockCount);
    return mockCount;
  };

  const resetCount = () => {
    setCount(0);
  };

  const markAllAsRead = async (): Promise<void> => {
    // Mock implementation - replace with actual API call
    setCount(0);
    return Promise.resolve();
  };

  // Count unread notifications on mount
  useEffect(() => {
    countUnread();
    
    // Check for new notifications periodically
    const interval = setInterval(() => {
      countUnread();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user]);

  return {
    count,
    setBadgeCount: setCount,
    countUnread,
    resetCount,
    markAllAsRead
  };
};

export default useNotificationBadge;
