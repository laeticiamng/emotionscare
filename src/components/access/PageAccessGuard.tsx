
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';

interface PageAccessGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredMode?: string;
  adminOnly?: boolean;
  b2bOnly?: boolean;
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  children,
  requiredRoles = [],
  requiredMode,
  adminOnly = false,
  b2bOnly = false
}) => {
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    checkAccess();
  }, [user, userMode, location.pathname]);

  const checkAccess = () => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      setAccessError('Vous devez être connecté pour accéder à cette page.');
      return;
    }

    // Vérifier le mode utilisateur
    if (requiredMode && userMode !== requiredMode) {
      setAccessError(`Cette page nécessite le mode ${requiredMode}.`);
      return;
    }

    // Vérifier les rôles requis
    if (requiredRoles.length > 0 && user?.role && !requiredRoles.includes(user.role)) {
      setAccessError('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
      return;
    }

    // Vérifier l'accès admin uniquement
    if (adminOnly && user?.role !== 'b2b_admin' && user?.role !== 'admin') {
      setAccessError('Cette page est réservée aux administrateurs.');
      return;
    }

    // Vérifier l'accès B2B uniquement
    if (b2bOnly && !userMode?.startsWith('b2b_')) {
      setAccessError('Cette page est réservée aux utilisateurs B2B.');
      return;
    }

    // Accès autorisé
    setAccessError(null);
  };

  const getRedirectPath = () => {
    if (!userMode) return UNIFIED_ROUTES.CHOOSE_MODE;
    
    switch (userMode) {
      case 'b2c':
        return UNIFIED_ROUTES.B2C_DASHBOARD;
      case 'b2b_user':
        return UNIFIED_ROUTES.B2B_USER_DASHBOARD;
      case 'b2b_admin':
        return UNIFIED_ROUTES.B2B_ADMIN_DASHBOARD;
      default:
        return UNIFIED_ROUTES.HOME;
    }
  };

  if (accessError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Accès refusé
              </h2>
              <p className="text-gray-600">
                {accessError}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button 
                onClick={() => navigate(getRedirectPath())}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Tableau de bord
              </Button>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Mode actuel: {userMode || 'Non défini'}</p>
              <p>Rôle: {user?.role || 'Non défini'}</p>
              <p>Page demandée: {location.pathname}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PageAccessGuard;
