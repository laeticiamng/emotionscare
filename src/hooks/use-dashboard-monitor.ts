
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserMode } from '@/utils/userModeHelpers';

/**
 * A hook that monitors dashboard access for debugging purposes
 * Logs information about the current user, route, and authentication state
 */
export const useDashboardMonitor = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  useEffect(() => {
    // Only log for dashboard routes
    if (location.pathname.includes('/dashboard') || 
        location.pathname.includes('/b2c') || 
        location.pathname.includes('/b2b')) {
      
      console.log('[DashboardMonitor] Current route:', location.pathname);
      console.log('[DashboardMonitor] User authenticated:', isAuthenticated);
      console.log('[DashboardMonitor] User role:', user?.role);
      console.log('[DashboardMonitor] User mode:', userMode);
      
      // Check for role/mode consistency
      if (user?.role && userMode) {
        const normalizedRole = normalizeUserMode(user.role);
        const normalizedMode = normalizeUserMode(userMode);
        
        if (normalizedRole !== normalizedMode) {
          console.warn('[DashboardMonitor] ⚠️ User role and mode mismatch:', {
            role: user.role,
            normalizedRole,
            userMode,
            normalizedMode
          });
        }
      }
    }
  }, [location.pathname, isAuthenticated, user, userMode]);
};
