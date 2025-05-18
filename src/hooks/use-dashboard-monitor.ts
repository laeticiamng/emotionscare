
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { env } from '@/env.mjs';

export function useDashboardMonitor() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    // Ajout d'un monitoring détaillé uniquement pour les chemins de dashboard
    if (location.pathname.includes('dashboard')) {
      console.log('[DashboardMonitor] Location:', location.pathname);
      console.log('[DashboardMonitor] Auth state:', { 
        isAuthenticated, 
        isLoading, 
        userRole: user?.role,
        env: {
          NODE_ENV: env.NODE_ENV
        }
      });
      
      // Vérifie si l'utilisateur a un rôle valide
      if (user && !user.role) {
        console.warn('[DashboardMonitor] User has no role defined');
      }
      
      // Vérifie si le chemin actuel correspond au rôle de l'utilisateur
      if (user?.role && isAuthenticated) {
        const userPath = location.pathname.toLowerCase();
        const doesPathMatchRole = 
          (user.role === 'b2c' && userPath.includes('/b2c/')) ||
          (user.role === 'b2b_user' && userPath.includes('/b2b/user/')) ||
          (user.role === 'b2b_admin' && userPath.includes('/b2b/admin/'));
        
        if (!doesPathMatchRole) {
          console.warn('[DashboardMonitor] User role does not match current path', {
            role: user.role,
            path: location.pathname
          });
        }
      }
    }
  }, [location.pathname, isAuthenticated, isLoading, user]);
  
  return null;
}

export default useDashboardMonitor;
