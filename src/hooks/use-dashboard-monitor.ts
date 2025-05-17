
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

/**
 * Hook to monitor dashboard access and potential routing issues
 * This helps debug any issues with accessing dashboards based on roles
 */
export function useDashboardMonitor() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();

  useEffect(() => {
    // Only log after everything is loaded
    if (!authLoading && !userModeLoading) {
      // Check if we're on a dashboard page
      const isDashboardPage = 
        location.pathname.includes('/dashboard') || 
        location.pathname === '/b2c' || 
        location.pathname === '/b2b/user' || 
        location.pathname === '/b2b/admin';
      
      if (isDashboardPage) {
        console.group('Dashboard Navigation Monitoring');
        console.log('Current path:', location.pathname);
        console.log('Authentication state:', { isAuthenticated, authLoading });
        console.log('User info:', user ? { 
          id: user.id,
          name: user.name,
          role: user.role
        } : 'No user');
        console.log('User mode:', { userMode, userModeLoading });
        
        // Check for potential issues
        if (isAuthenticated && user) {
          // Check if on the correct dashboard for user role
          if (user.role === 'b2c' && !location.pathname.startsWith('/b2c')) {
            console.warn('B2C user accessing non-B2C dashboard!');
          } else if (user.role === 'b2b_user' && !location.pathname.startsWith('/b2b/user')) {
            console.warn('B2B user accessing non-B2B-user dashboard!');
          } else if (user.role === 'b2b_admin' && !location.pathname.startsWith('/b2b/admin')) {
            console.warn('B2B admin accessing non-B2B-admin dashboard!');
          }
          
          // Check for role/mode inconsistency
          if (userMode !== user.role) {
            console.warn('User role and mode mismatch!', { role: user.role, mode: userMode });
          }
        }
        
        console.groupEnd();
      }
    }
  }, [location.pathname, isAuthenticated, user, userMode, authLoading, userModeLoading]);
  
  return null;
}

export default useDashboardMonitor;
