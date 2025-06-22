
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { UNIFIED_ROUTES, validateUniqueRoutes } from '@/utils/routeUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Home } from 'lucide-react';

interface RouteValidatorProps {
  children: React.ReactNode;
}

const RouteValidator: React.FC<RouteValidatorProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  const [routeValidation, setRouteValidation] = useState<{
    isValid: boolean;
    hasAccess: boolean;
    errorMessage?: string;
    suggestedRoute?: string;
  }>({ isValid: true, hasAccess: true });

  useEffect(() => {
    // Validation de l'unicité des routes au chargement
    if (!validateUniqueRoutes()) {
      console.error('ERREUR CRITIQUE: Doublons de routes détectés!');
    }

    // Validation de l'accès à la route actuelle
    const currentPath = location.pathname;
    
    // Routes publiques - toujours accessibles
    const publicRoutes = [
      UNIFIED_ROUTES.HOME,
      UNIFIED_ROUTES.CHOOSE_MODE,
      UNIFIED_ROUTES.B2B_SELECTION,
      UNIFIED_ROUTES.B2C_LOGIN,
      UNIFIED_ROUTES.B2C_REGISTER,
      UNIFIED_ROUTES.B2B_USER_LOGIN,
      UNIFIED_ROUTES.B2B_USER_REGISTER,
      UNIFIED_ROUTES.B2B_ADMIN_LOGIN
    ];

    if (publicRoutes.includes(currentPath as any)) {
      setRouteValidation({ isValid: true, hasAccess: true });
      return;
    }

    // Vérification de l'authentification pour les routes protégées
    if (!isAuthenticated) {
      setRouteValidation({
        isValid: false,
        hasAccess: false,
        errorMessage: 'Authentification requise',
        suggestedRoute: UNIFIED_ROUTES.CHOOSE_MODE
      });
      return;
    }

    // Vérification de l'accès selon le rôle
    const userRole = user?.role || userMode;
    let hasAccess = true;
    let suggestedRoute = UNIFIED_ROUTES.HOME;

    // Routes admin uniquement
    const adminOnlyRoutes = [
      UNIFIED_ROUTES.TEAMS,
      UNIFIED_ROUTES.REPORTS,
      UNIFIED_ROUTES.EVENTS,
      UNIFIED_ROUTES.OPTIMISATION,
      UNIFIED_ROUTES.SETTINGS
    ];

    if (adminOnlyRoutes.includes(currentPath as any) && userRole !== 'b2b_admin') {
      hasAccess = false;
      suggestedRoute = userRole === 'b2c' 
        ? UNIFIED_ROUTES.B2C_DASHBOARD 
        : UNIFIED_ROUTES.B2B_USER_DASHBOARD;
    }

    // Redirection vers le bon dashboard si accès au dashboard générique
    if (currentPath === '/dashboard') {
      switch (userRole) {
        case 'b2c':
          suggestedRoute = UNIFIED_ROUTES.B2C_DASHBOARD;
          hasAccess = false;
          break;
        case 'b2b_user':
          suggestedRoute = UNIFIED_ROUTES.B2B_USER_DASHBOARD;
          hasAccess = false;
          break;
        case 'b2b_admin':
          suggestedRoute = UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
          hasAccess = false;
          break;
      }
    }

    setRouteValidation({
      isValid: hasAccess,
      hasAccess,
      errorMessage: !hasAccess ? 'Accès non autorisé pour votre rôle' : undefined,
      suggestedRoute
    });

  }, [location.pathname, isAuthenticated, user, userMode]);

  // Redirection automatique si pas d'accès
  useEffect(() => {
    if (!routeValidation.hasAccess && routeValidation.suggestedRoute) {
      const timer = setTimeout(() => {
        navigate(routeValidation.suggestedRoute!, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [routeValidation, navigate]);

  // Affichage d'erreur si route invalide
  if (!routeValidation.isValid || !routeValidation.hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-semibold">Accès Restreint</h2>
            <Alert>
              <AlertDescription>
                {routeValidation.errorMessage || 'Cette page n\'est pas accessible.'}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Redirection automatique dans 3 secondes...
            </p>
            <Button 
              onClick={() => navigate(routeValidation.suggestedRoute || UNIFIED_ROUTES.HOME)}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Indicateur de validation en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 z-50">
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Route validée
          </div>
        </div>
      )}
    </>
  );
};

export default RouteValidator;
