
import { useState } from 'react';
import { NotificationBadge } from '@/types/notification';

export const useNotificationBadge = (initialCount = 0) => {
  const [badgeState, setBadgeState] = useState<NotificationBadge>({
    count: initialCount,
    hasNew: initialCount > 0,
    lastSeen: new Date().toISOString()
  });
  
  const incrementCount = (amount = 1) => {
    setBadgeState(prev => ({
      count: prev.count + amount,
      hasNew: true,
      lastSeen: prev.lastSeen
    }));
  };
  
  const decrementCount = (amount = 1) => {
    setBadgeState(prev => ({
      count: Math.max(0, prev.count - amount),
      hasNew: prev.count - amount > 0,
      lastSeen: prev.lastSeen
    }));
  };
  
  const markAsRead = () => {
    setBadgeState(prev => ({
      count: 0,
      hasNew: false,
      lastSeen: new Date().toISOString()
    }));
  };
  
  return {
    badge: badgeState,
    incrementCount,
    decrementCount,
    markAsRead
  };
};

export default useNotificationBadge;
