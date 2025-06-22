
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { validateRouteAccess, RouteValidationResult } from '@/utils/routeValidation';
import { toast } from 'sonner';

export const usePageValidation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  const [validation, setValidation] = useState<RouteValidationResult | null>(null);

  useEffect(() => {
    const result = validateRouteAccess(
      location.pathname,
      isAuthenticated,
      user?.role || userMode
    );

    setValidation(result);

    // Gestion des redirections automatiques
    if (!result.isValid || !result.hasAccess) {
      if (result.suggestedRoute) {
        toast.error(result.errorMessage || 'Accès non autorisé', {
          action: {
            label: 'Rediriger',
            onClick: () => navigate(result.suggestedRoute!, { replace: true })
          }
        });
        
        // Redirection automatique après 3 secondes
        const timer = setTimeout(() => {
          navigate(result.suggestedRoute!, { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
      }
    }

    // Log pour le debug
    console.log('Page validation:', {
      path: location.pathname,
      result,
      userRole: user?.role || userMode
    });

  }, [location.pathname, isAuthenticated, user?.role, userMode, navigate]);

  return {
    validation,
    isValid: validation?.isValid ?? false,
    hasAccess: validation?.hasAccess ?? false,
    errorMessage: validation?.errorMessage,
    suggestedRoute: validation?.suggestedRoute,
    requiresAuth: validation?.requiresAuth ?? false
  };
};
