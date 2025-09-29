
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { validateRouteAccess, RouteValidationResult } from '@/utils/routeValidation';

export const usePageValidation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  const [validationResult, setValidationResult] = useState<RouteValidationResult>({
    isValid: true,
    hasAccess: true,
    requiresAuth: false
  });
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    setIsValidating(true);
    
    const result = validateRouteAccess(
      location.pathname,
      isAuthenticated,
      user?.role || userMode
    );
    
    setValidationResult(result);
    setIsValidating(false);
    
    // Log de validation pour le debug
    console.log('Page validation:', {
      path: location.pathname,
      user: user?.role || userMode,
      authenticated: isAuthenticated,
      result
    });
  }, [location.pathname, isAuthenticated, user?.role, userMode]);

  return {
    ...validationResult,
    isValidating,
    currentPath: location.pathname
  };
};
