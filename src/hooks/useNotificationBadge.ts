
import { useState, useEffect } from 'react';

export interface NotificationBadgeState {
  count: number;
  badgesCount: number;
  clearBadge: () => void;
}

export const useNotificationBadge = (userId?: string): NotificationBadgeState => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!userId) return;
    
    // Simulating loading notifications from an API or local storage
    const loadNotificationCount = () => {
      // For demo purposes, we'll use a random number
      // In a real app, you would fetch this from your notifications API
      const randomCount = Math.floor(Math.random() * 5);
      setCount(randomCount);
    };
    
    loadNotificationCount();
    
    // Optionally set up a polling interval to check for new notifications
    const intervalId = setInterval(() => {
      loadNotificationCount();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [userId]);
  
  const clearBadge = () => {
    setCount(0);
  };
  
  return {
    count,
    badgesCount: count, // Make badgesCount same as count for compatibility
    clearBadge
  };
};
