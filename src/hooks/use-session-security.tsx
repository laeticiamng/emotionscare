
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseSessionSecurityOptions {
  sessionTimeout?: number;
  warningTime?: number;
}

// Default options
const defaultOptions: UseSessionSecurityOptions = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  warningTime: 1 * 60 * 1000,    // 1 minute
};

export const useSessionSecurity = (options: Partial<UseSessionSecurityOptions> = {}) => {
  const { logout, isAuthenticated } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Merge default options with provided options
  const sessionOptions = {
    ...defaultOptions,
    ...options
  };

  const { sessionTimeout, warningTime } = sessionOptions;
  const warningThreshold = sessionTimeout - warningTime;

  // Reset the timer when user activity is detected
  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Effect to handle user activity tracking
  useEffect(() => {
    // Only track activity if authenticated
    if (!isAuthenticated) return;

    // Events to track for user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    // Function to update last activity time
    const updateActivity = () => {
      resetTimer();
    };
    
    // Add event listeners for each activity type
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    // Clean up event listeners
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [resetTimer, isAuthenticated]);
  
  // Effect to check session timeout
  useEffect(() => {
    // Only check timeout if authenticated
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;
      const remainingTime = sessionTimeout - timeSinceLastActivity;
      
      setTimeLeft(Math.max(0, remainingTime));
      
      if (timeSinceLastActivity > sessionTimeout) {
        // Session has expired, log user out
        logout();
        setShowWarning(false);
      } else if (timeSinceLastActivity > warningThreshold && !showWarning) {
        // Show warning before session expires
        setShowWarning(true);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [lastActivity, sessionTimeout, warningThreshold, showWarning, logout, isAuthenticated]);

  return {
    showWarning,
    resetTimer,
    sessionExpiresIn: Math.max(0, sessionTimeout - (Date.now() - lastActivity)),
    timeLeft
  };
};

export default useSessionSecurity;
