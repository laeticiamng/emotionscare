
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SessionSecurityOptions {
  timeout?: number; // In minutes
  showWarning?: boolean;
  warningTime?: number; // Minutes before timeout to show warning
}

export const useSessionSecurity = (options: SessionSecurityOptions = {}) => {
  const {
    timeout = 30, // Default timeout of 30 minutes
    showWarning = true,
    warningTime = 5, // Warning 5 minutes before timeout
  } = options;

  const { toast } = useToast();
  const { logout, isAuthenticated } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showWarningState, setShowWarningState] = useState<boolean>(false);

  // Convert minutes to milliseconds
  const timeoutMs = timeout * 60 * 1000;
  const warningTimeMs = warningTime * 60 * 1000;

  // Update last activity time on user interaction
  const updateActivity = () => {
    setLastActivity(Date.now());
    setShowWarningState(false);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    // Check session status periodically
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // Show warning before timeout
      if (showWarning && timeSinceLastActivity > timeoutMs - warningTimeMs && !showWarningState) {
        setShowWarningState(true);
        toast('Votre session va expirer bientôt. Souhaitez-vous rester connecté ?', 'warning', {
          duration: 10000,
          // You could add action buttons here in a real implementation
        });
      }

      // Log out user after inactivity
      if (timeSinceLastActivity > timeoutMs) {
        logout();
        toast('Vous avez été déconnecté en raison d\'inactivité', 'info');
      }
    }, 30000); // Check every 30 seconds

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(checkInterval);
    };
  }, [isAuthenticated, lastActivity, logout, showWarning, showWarningState, timeoutMs, warningTimeMs]);

  return {
    resetTimer: updateActivity,
    sessionExpiresIn: Math.max(0, timeoutMs - (Date.now() - lastActivity)),
    showWarning: showWarningState,
  };
};

export default useSessionSecurity;
