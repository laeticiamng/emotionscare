import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleHomePath } from './use-role-redirect';
import { normalizeUserMode } from '@/utils/userModeHelpers';

/**
 * Unify access flow by redirecting users based on their authentication
 * status and stored preferred mode. When visiting generic paths like
 * `/` or `/login`, the user is automatically routed to the most
 * relevant area of the app.
 */
export function usePreferredAccess() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // If the user is authenticated and lands on a neutral page, redirect
    if (isAuthenticated && user) {
      if (location.pathname === '/' || location.pathname === '/login') {
        navigate(getRoleHomePath(user.role), { replace: true });
        return;
      }
      return;
    }

    // User not authenticated: auto-select login/register page based on stored mode
    const storedMode = localStorage.getItem('userMode');
    if (!storedMode) return;
    const normalized = normalizeUserMode(storedMode);

    if (location.pathname === '/login') {
      const target =
        normalized === 'b2b_admin'
          ? '/b2b/admin/login'
          : normalized === 'b2b_user'
          ? '/b2b/user/login'
          : '/b2c/login';
      navigate(target, { replace: true });
    } else if (location.pathname === '/register') {
      const target =
        normalized === 'b2b_admin'
          ? '/b2b/admin/register'
          : normalized === 'b2b_user'
          ? '/b2b/user/register'
          : '/b2c/register';
      navigate(target, { replace: true });
    } else if (location.pathname === '/') {
      // Not authenticated but a preferred mode exists: send directly to the corresponding login
      const target =
        normalized === 'b2b_admin'
          ? '/b2b/admin/login'
          : normalized === 'b2b_user'
          ? '/b2b/user/login'
          : '/b2c/login';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, location.pathname, navigate]);
}

export default usePreferredAccess;
