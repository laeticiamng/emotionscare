
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMigratedRoute } from './routeUtils';

/**
 * DÉPRÉCIÉ - Hook pour redirection automatique des routes legacy
 * Sera supprimé une fois toutes les références nettoyées
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
    const migratedPath = getMigratedRoute(currentPath);
    
    // Si la route a été migrée, rediriger
    if (migratedPath !== currentPath) {
      console.warn(`[DEPRECATED] Legacy route ${currentPath} redirected to ${migratedPath}`);
      console.warn('This redirect will be removed in the next version. Please update your navigation code.');
      
      navigate(migratedPath, { replace: true });
    }
  }, [location.pathname, navigate]);
};

/**
 * @deprecated Use getMigratedRoute from routeUtils instead
 */
export const getLegacyRedirect = (path: string): string => {
  console.warn('getLegacyRedirect is deprecated. Use getMigratedRoute from routeUtils instead.');
  return getMigratedRoute(path);
};
