// @ts-nocheck

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getModeDashboardPath, normalizeUserMode } from '@/utils/userModeHelpers';
import { logger } from '@/lib/logger';

/**
 * Hook qui gère la redirection automatique des utilisateurs
 * notamment depuis la page /b2b/selection vers le bon tableau de bord
 */
const usePreferredAccess = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (isLoading) return;

    // Si l'utilisateur est sur /b2b/selection et est authentifié,
    // le rediriger vers son tableau de bord approprié
    if (location.pathname === '/b2b/selection' && isAuthenticated && user?.role) {
      const normalizedRole = normalizeUserMode(user.role);
      const dashboardPath = getModeDashboardPath(normalizedRole);
      
      // Ajouter un léger délai pour une meilleure expérience visuelle
      setTimeout(() => {
        navigate(dashboardPath, { replace: true });
        
        // Montrer un toast animé pour expliquer la redirection
        toast({
          title: "Redirection automatique",
          description: `Vous êtes connecté en tant que ${normalizedRole === 'b2b_admin' ? 'administrateur' : 'collaborateur'}`,
          variant: "default"
        });
      }, 300);
      
      logger.info('[usePreferredAccess] Redirected user to dashboard', { dashboardPath }, 'AUTH');
    }
    
    // Si l'utilisateur tente d'accéder à un dashboard qui ne correspond pas à son rôle,
    // le rediriger vers le bon dashboard
    if (isAuthenticated && user?.role && 
        (location.pathname.includes('/dashboard') || location.pathname.includes('/profile'))) {
      
      const normalizedRole = normalizeUserMode(user.role);
      const correctPathPrefix = 
        normalizedRole === 'b2b_admin' ? '/b2b/admin' :
        normalizedRole === 'b2b_user' ? '/b2b/user' :
        '/b2c';
      
      // Vérifier si l'utilisateur est sur le mauvais dashboard
      if (!location.pathname.startsWith(correctPathPrefix)) {
        const correctDashboardPath = getModeDashboardPath(normalizedRole);
        
        toast({
          title: "Accès non autorisé",
          description: `Redirection vers votre espace ${normalizedRole === 'b2b_admin' ? 'administrateur' : 
            normalizedRole === 'b2b_user' ? 'collaborateur' : 'personnel'}`,
          variant: "default"
        });
        
        navigate(correctDashboardPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, toast]);

  return { isAuthenticated, user, isLoading };
};

export { usePreferredAccess };
export default usePreferredAccess;
