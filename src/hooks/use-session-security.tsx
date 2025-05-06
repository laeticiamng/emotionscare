
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useSessionSecurity(
  inactivityTimeoutMs: number = 30 * 60 * 1000, // Default 30 minutes
  warningTimeMs: number = 60 * 1000 // Warning 1 minute before logout
) {
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const { isAuthenticated, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to handle user activity
  const handleUserActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowWarning(false);
  }, []);

  // Check for inactivity
  useEffect(() => {
    if (!isAuthenticated) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Set up interval to check inactivity
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      
      // Show warning before logout
      if (timeElapsed >= inactivityTimeoutMs - warningTimeMs && !showWarning) {
        setShowWarning(true);
        toast({
          title: "Session expiration",
          description: `Your session will expire in ${Math.round(warningTimeMs / 1000 / 60)} minute(s) due to inactivity.`,
          duration: warningTimeMs,
        });
      }
      
      // Logout if inactive
      if (timeElapsed >= inactivityTimeoutMs) {
        signOut().then(() => {
          toast({
            title: "Session expired",
            description: "You have been logged out due to inactivity.",
            variant: "destructive",
          });
          navigate('/login');
        });
      }
    }, 10000); // Check every 10 seconds

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(intervalId);
    };
  }, [
    isAuthenticated, 
    lastActivity, 
    handleUserActivity, 
    inactivityTimeoutMs, 
    warningTimeMs, 
    showWarning, 
    signOut, 
    toast, 
    navigate
  ]);

  // Reset timer on demand (useful after important actions)
  const resetTimer = () => {
    handleUserActivity();
  };

  return {
    showWarning,
    resetTimer,
    timeLeft: Math.max(0, inactivityTimeoutMs - (Date.now() - lastActivity))
  };
}
