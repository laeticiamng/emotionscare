
import { useState } from 'react';

export interface NotificationBadge {
  count: number;
  hasNew: boolean;
  lastSeen?: string;
}

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
  
  // Return the count directly along with the badge and methods
  return {
    badge: badgeState,
    count: badgeState.count, // Add direct count access
    incrementCount,
    decrementCount,
    markAsRead
  };
};

export default useNotificationBadge;
