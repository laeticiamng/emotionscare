
import { useState, useEffect } from 'react';

export const useSessionSecurity = (options = {}) => {
  const {
    warningTime = 50000, // 50 seconds
    logoutTime = 60000,  // 60 seconds
  } = options;

  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(logoutTime);

  // Reset timer when user activity is detected
  const resetTimer = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  // Listen for user activity
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      // Remove event listeners
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  // Check session timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const idle = now - lastActivity;
      
      // Show warning when approaching timeout
      if (idle >= warningTime && idle < logoutTime) {
        if (!showWarning) {
          setShowWarning(true);
        }
        setTimeLeft(logoutTime - idle);
      }

      // Logout when timeout is reached
      if (idle >= logoutTime) {
        // In a real app, this would log the user out
        console.log('Session timeout: User would be logged out');
        // Reset the timer after "logging out"
        resetTimer();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, warningTime, logoutTime, showWarning]);

  return {
    showWarning,
    resetTimer,
    timeLeft,
  };
};

export default useSessionSecurity;
