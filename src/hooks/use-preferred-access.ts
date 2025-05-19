
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getModeDashboardPath, normalizeUserMode } from '@/utils/userModeHelpers';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      navigate(dashboardPath, { replace: true });
      
      // Montrer un toast animé pour expliquer la redirection
      toast({
        title: "Redirection automatique",
        description: `Vous êtes connecté en tant que ${normalizedRole === 'b2b_admin' ? 'administrateur' : 'collaborateur'}`,
        variant: "default"
      });
      
      console.log('[usePreferredAccess] Redirected user to dashboard:', dashboardPath);
    }
  }, [isAuthenticated, user, isLoading, navigate, location.pathname, toast]);

  return { isAuthenticated, user, isLoading };
};

export { usePreferredAccess };
export default usePreferredAccess;
