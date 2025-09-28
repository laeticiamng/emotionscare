
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user';
import { normalizeUserMode, getModeDashboardPath } from '@/utils/userModeHelpers';

/**
 * Get the home path for a specific user role
 */
export function getRoleHomePath(role: UserRole | string | undefined | null): string {
  if (!role) return '/b2c/dashboard';
  
  // Use the existing utility function to get the dashboard path based on normalized role
  const normalizedMode = normalizeUserMode(role);
  return getModeDashboardPath(normalizedMode);
}

/**
 * Hook to determine the home path based on user role and handle redirections
 */
export function useRoleRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't do anything while authentication is still being loaded
    if (isLoading) return;
    
    // Only redirect if user is authenticated AND currently on the explicit login/register page or root
    // This prevents redirecting users who are already browsing the app
    const isExplicitLoginPage = 
      location.pathname === '/' || 
      location.pathname === '/b2c/login' ||
      location.pathname === '/b2c/register' ||
      location.pathname === '/b2b/user/login' ||
      location.pathname === '/b2b/admin/login';
    
    if (isAuthenticated && user && isExplicitLoginPage) {
      console.log('[useRoleRedirect] Redirecting authenticated user to:', getModeDashboardPath(normalizeUserMode(user.role)));
      navigate(getModeDashboardPath(normalizeUserMode(user.role)));
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname]);
  
  return { user, isAuthenticated, isLoading };
}

export default useRoleRedirect;
