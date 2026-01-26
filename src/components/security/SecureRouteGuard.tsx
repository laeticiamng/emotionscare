// @ts-nocheck

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import LoadingAnimation from '@/components/ui/loading-animation';

interface SecureRouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

const SecureRouteGuard: React.FC<SecureRouteGuardProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  fallbackPath = '/mode-selection'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  // Vérification de l'authentification
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />;
  }

  // Vérification des rôles
  if (allowedRoles.length > 0 && user) {
    const userRole = user.role || user.user_metadata?.role;
    
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-red-800">Accès refusé</h2>
                <p className="text-muted-foreground mb-4">
                  Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <p className="text-sm text-muted-foreground">
                  Rôle requis: {allowedRoles.join(', ')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Votre rôle: {userRole || 'Non défini'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default SecureRouteGuard;
