
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Session security configuration
const SESSION_TIMEOUT_MINUTES = 15;
const ACTIVITY_EVENTS = [
  'mousedown', 'keydown', 'touchstart', 'scroll'
];

export function useSessionSecurity() {
  const { logout, isAuthenticated } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  // Reset the last activity timestamp when user interacts with the page
  const updateActivity = () => {
    setLastActivity(Date.now());
    setTimeoutWarning(false);
  };
  
  // Monitor for user inactivity and log them out if inactive for too long
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Add event listeners for user activity
    ACTIVITY_EVENTS.forEach(event => 
      window.addEventListener(event, updateActivity, { passive: true })
    );
    
    // Check for inactivity every minute
    const checkInterval = setInterval(() => {
      const inactiveTimeMinutes = (Date.now() - lastActivity) / (1000 * 60);
      
      // Show warning when 1 minute before timeout
      if (inactiveTimeMinutes >= SESSION_TIMEOUT_MINUTES - 1 && !timeoutWarning) {
        setTimeoutWarning(true);
      }
      
      // Log out after timeout period
      if (inactiveTimeMinutes >= SESSION_TIMEOUT_MINUTES) {
        console.log(`Session expired after ${SESSION_TIMEOUT_MINUTES} minutes of inactivity`);
        logout();
      }
    }, 60000);
    
    return () => {
      // Clean up event listeners and interval
      ACTIVITY_EVENTS.forEach(event => 
        window.removeEventListener(event, updateActivity)
      );
      clearInterval(checkInterval);
    };
  }, [lastActivity, logout, isAuthenticated, timeoutWarning]);
  
  return {
    timeoutWarning,
    resetActivity: updateActivity
  };
}
