import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock } from 'lucide-react';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('b2c' | 'b2b_user' | 'b2b_admin')[];
  requireEmailVerified?: boolean;
  fallbackPath?: string;
}

const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
  requireEmailVerified = false,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Vérification...</h2>
              <p className="text-muted-foreground">Authentification en cours</p>
              <div className="mt-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Vérification des rôles requis
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-red-800">Accès refusé</h2>
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <p className="text-sm text-muted-foreground">
                  Rôle requis: {allowedRoles.join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Votre rôle: {user.role}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Vérification de l'email si requis
  if (requireEmailVerified && user?.email && !user.email) {
    return <Navigate to={routes.auth.verifyEmail()} state={{ from: location.pathname }} replace />;
  }

  // Tout est OK, afficher le contenu
  return <>{children}</>;
};

export default EnhancedProtectedRoute;