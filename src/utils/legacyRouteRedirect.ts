
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * DÉPRÉCIÉ - Sera supprimé dans la prochaine version
 * Redirection temporaire pour compatibilité pendant migration backend
 */

const LEGACY_REDIRECTS = {
  '/login-collaborateur': '/b2b/user/login',
  '/login-admin': '/b2b/admin/login',
  '/login': '/choose-mode',
} as const;

export const useLegacyRouteRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const redirectPath = LEGACY_REDIRECTS[currentPath as keyof typeof LEGACY_REDIRECTS];
    
    if (redirectPath) {
      console.warn(`[DEPRECATED] Legacy route ${currentPath} redirected to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, navigate]);
};
