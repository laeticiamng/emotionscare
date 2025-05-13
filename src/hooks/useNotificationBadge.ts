
import { useState, useEffect } from 'react';

export const useNotificationBadge = () => {
  const [count, setCount] = useState<number>(0);
  
  useEffect(() => {
    // Mock notification count - in a real app this would come from an API or context
    const mockNotifications = Math.floor(Math.random() * 5);
    setCount(mockNotifications);
    
    // Simulate new notifications coming in
    const intervalId = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7;
      if (shouldAddNotification) {
        setCount(prevCount => prevCount + 1);
      }
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  const clearBadge = () => {
    setCount(0);
  };
  
  return { count, clearBadge };
};
