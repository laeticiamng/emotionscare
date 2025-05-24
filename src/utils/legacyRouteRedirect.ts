
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Gestion temporaire des redirections pour anciennes routes
 * À supprimer une fois que tous les liens externes sont mis à jour
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
      console.warn(`[LegacyRedirect] Redirecting from legacy route ${currentPath} to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [location.pathname, navigate]);
};
