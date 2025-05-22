import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getModeDashboardPath, getModeLoginPath, normalizeUserMode } from '@/utils/userModeHelpers';
import { logDashboardAccessDenied } from '@/utils/securityLogs';

/**
 * Redirects the user to the correct dashboard based on their role.
 * Unauthenticated users are redirected to the appropriate login page.
 */
const DashboardRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      logDashboardAccessDenied(null, location.pathname);
      navigate(getModeLoginPath('b2c'), { replace: true });
      return;
    }

    if (user) {
      const role = normalizeUserMode(user.role);
      navigate(getModeDashboardPath(role), { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  return null;
};

export default DashboardRedirect;
