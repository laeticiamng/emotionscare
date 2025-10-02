import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

interface PageAccessGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackComponent?: React.ReactNode;
}

const PageAccessGuard: React.FC<PageAccessGuardProps> = ({
  children,
  requiredRoles = [],
  fallbackComponent
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  if (isLoading || modeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification des autorisations..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallbackComponent || (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
          <p className="text-muted-foreground">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (requiredRoles.length > 0) {
    const userRole = user?.role || userMode || '';
    if (!requiredRoles.includes(userRole)) {
      return fallbackComponent || (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour cette page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default PageAccessGuard;
