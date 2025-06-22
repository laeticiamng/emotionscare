
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { useSecurityContext } from '@/components/security/SecurityProvider';
import { usePageValidation } from '@/hooks/usePageValidation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

interface PageAccessGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredRole?: string;
  fallbackComponent?: React.ReactNode;
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  children,
  adminOnly = false,
  requiredRole,
  fallbackComponent
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { userMode } = useUserMode();
  const { logAccess } = useSecurityContext();
  const { validation, hasAccess, errorMessage, suggestedRoute } = usePageValidation();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = user?.role || userMode;

  useEffect(() => {
    // Log d'accès pour audit
    if (isAuthenticated) {
      logAccess(location.pathname, hasAccess, errorMessage);
    }
  }, [location.pathname, isAuthenticated, hasAccess, errorMessage, logAccess]);

  // Chargement
  if (isLoading || !validation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation text="Vérification des accès..." />
      </div>
    );
  }

  // Vérification d'accès admin
  if (adminOnly && currentRole !== 'b2b_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Lock className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-xl font-semibold">Accès Administrateur Requis</h2>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cette page est réservée aux administrateurs RH.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Votre rôle actuel: <strong>{currentRole || 'Non défini'}</strong>
              </p>
              <Button 
                onClick={() => navigate(suggestedRoute || '/home')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérification de rôle spécifique
  if (requiredRole && currentRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Shield className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-semibold">Rôle Insuffisant</h2>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Rôle requis: <strong>{requiredRole}</strong><br />
                Votre rôle: <strong>{currentRole || 'Non défini'}</strong>
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate(suggestedRoute || '/home')}
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

  // Vérification générale des accès
  if (!hasAccess) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto" />
            <h2 className="text-xl font-semibold">Accès Restreint</h2>
            <Alert>
              <AlertDescription>
                {errorMessage || 'Vous n\'avez pas accès à cette page.'}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Mode utilisateur: <strong>{userMode || 'Non défini'}</strong>
              </p>
              <Button 
                onClick={() => navigate(suggestedRoute || '/home')}
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                Aller à votre espace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accès autorisé - rendu des enfants avec indicateur visuel
  return (
    <div className="relative">
      {children}
      
      {/* Indicateur d'accès validé en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Accès validé
          </div>
        </div>
      )}
    </div>
  );
};

export default PageAccessGuard;
