
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Session security configuration (configurable for future hardening)
const SESSION_TIMEOUT_MINUTES = 15;
const ACTIVITY_EVENTS = [
  'mousedown', 'keydown', 'touchstart', 'scroll'
];

export function useSessionSecurity() {
  const { logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  // Reset the last activity timestamp when user interacts with the page
  const updateActivity = () => {
    setLastActivity(Date.now());
    if (timeoutWarning) {
      setTimeoutWarning(false);
      toast({
        title: "Session prolongée",
        description: "Votre activité a été détectée. Votre session a été prolongée.",
        variant: "default"
      });
    }
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
        toast({
          title: "Alerte d'inactivité",
          description: "Votre session se terminera dans 1 minute en raison d'inactivité",
          variant: "destructive",
          duration: 60000 // Show until session times out or user interacts
        });
      }
      
      // Log out after timeout period
      if (inactiveTimeMinutes >= SESSION_TIMEOUT_MINUTES) {
        console.log(`Session expired after ${SESSION_TIMEOUT_MINUTES} minutes of inactivity`);
        toast({
          title: "Session expirée",
          description: "Vous avez été déconnecté en raison d'inactivité",
          variant: "destructive"
        });
        logout();
      }
    }, 20000); // Check every 20 seconds (more responsive)
    
    return () => {
      // Clean up event listeners and interval
      ACTIVITY_EVENTS.forEach(event => 
        window.removeEventListener(event, updateActivity)
      );
      clearInterval(checkInterval);
    };
  }, [lastActivity, logout, isAuthenticated, timeoutWarning, toast]);
  
  return {
    timeoutWarning,
    resetActivity: updateActivity,
    sessionTimeoutMinutes: SESSION_TIMEOUT_MINUTES
  };
}
