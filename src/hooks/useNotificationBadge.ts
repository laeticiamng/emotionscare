
import { useState, useEffect } from 'react';

export interface NotificationBadge {
  count: number;
  setBadgesCount?: (count: number) => void;
  clearBadges?: () => void;
}

export const useNotificationBadge = (): NotificationBadge => {
  const [count, setCount] = useState(0);

  const setBadgesCount = (newCount: number) => {
    setCount(newCount);
  };

  const clearBadges = () => {
    setCount(0);
  };

  // Add badge to document title when count changes
  useEffect(() => {
    const originalTitle = document.title.replace(/^\(\d+\) /, '');
    
    if (count > 0) {
      document.title = `(${count}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
    
    return () => {
      document.title = originalTitle;
    };
  }, [count]);

  return {
    count,
    setBadgesCount,
    clearBadges
  };
};

export default useNotificationBadge;
