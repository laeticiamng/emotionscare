
import { useState, useCallback } from 'react';
import { NotificationBadge } from '@/types/notification';

export const useNotificationBadge = (initialCount = 0) => {
  const [badge, setBadge] = useState<NotificationBadge>({
    count: initialCount,
    active: initialCount > 0,
    badgesCount: 0,
    notificationsCount: 0
  });

  const incrementCount = useCallback((amount = 1) => {
    setBadge(prev => ({
      ...prev,
      count: prev.count + amount,
      active: (prev.count + amount) > 0
    }));
  }, []);

  const decrementCount = useCallback((amount = 1) => {
    setBadge(prev => ({
      ...prev,
      count: Math.max(0, prev.count - amount),
      active: (prev.count - amount) > 0
    }));
  }, []);

  const markAsRead = useCallback(() => {
    setBadge(prev => ({
      ...prev,
      count: 0,
      active: false
    }));
  }, []);
  
  return {
    badge,
    count: badge.count,
    badgesCount: badge.badgesCount,
    notificationsCount: badge.notificationsCount,
    incrementCount,
    decrementCount,
    markAsRead
  };
};

export default useNotificationBadge;
