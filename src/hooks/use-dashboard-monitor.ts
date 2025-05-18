
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useLocation } from 'react-router-dom';
import { normalizeUserMode } from '@/utils/userModeHelpers';

/**
 * This hook monitors dashboard access and logs detailed information for debugging
 * It doesn't perform any actions, just logs data for troubleshooting
 */
export function useDashboardMonitor() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const location = useLocation();

  useEffect(() => {
    // Only log on dashboard paths to avoid spamming the console
    if (!location.pathname.includes('dashboard')) return;

    console.group('🔍 Dashboard Access Monitor');
    console.log('📍 Current path:', location.pathname);
    console.log('🔑 Authentication:', {
      isAuthenticated,
      isLoading: authLoading,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role
      } : null
    });
    
    console.log('👤 User Mode:', {
      mode: userMode,
      isLoading: userModeLoading
    });
    
    if (user?.role && userMode) {
      const normalizedRole = normalizeUserMode(user.role);
      const normalizedMode = normalizeUserMode(userMode);
      
      if (normalizedRole !== normalizedMode) {
        console.warn('⚠️ Role/Mode mismatch!', {
          userRole: user.role,
          normalizedRole,
          userMode,
          normalizedMode
        });
      } else {
        console.log('✅ Role/Mode match correctly');
      }
    }
    
    console.groupEnd();
  }, [location.pathname, user, isAuthenticated, authLoading, userMode, userModeLoading]);
}

export default useDashboardMonitor;
