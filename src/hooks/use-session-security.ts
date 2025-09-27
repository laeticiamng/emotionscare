
import { useState, useEffect, useCallback } from 'react';

export interface UseSessionSecurityOptions {
  warningTimeBeforeExpire?: number;
  sessionDuration?: number;
}

export function useSessionSecurity({
  warningTimeBeforeExpire = 60, // Default: 60 seconds
  sessionDuration = 30 * 60, // Default: 30 minutes
}: UseSessionSecurityOptions = {}) {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(sessionDuration);
  
  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setTimeLeft(sessionDuration);
  }, [sessionDuration]);

  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };
    
    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Check session status every second
    const interval = setInterval(() => {
      const now = Date.now();
      const idle = (now - lastActivity) / 1000;
      const remainingTime = sessionDuration - idle;
      setTimeLeft(Math.max(0, remainingTime));
      
      if (remainingTime <= warningTimeBeforeExpire && !showWarning) {
        setShowWarning(true);
      }
      
      // If session expired, handle it
      if (remainingTime <= 0) {
        // Session expired, you can add logic here to log out the user
        console.log('Session expired');
        // Clear the warning
        setShowWarning(false);
      }
    }, 1000);
    
    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(interval);
    };
  }, [lastActivity, resetTimer, sessionDuration, showWarning, warningTimeBeforeExpire]);
  
  return {
    resetTimer,
    sessionExpiresIn: timeLeft,
    showWarning,
    timeLeft
  };
}
