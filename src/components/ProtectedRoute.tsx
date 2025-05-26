
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingIllustration } from '@/components/ui/loading-illustration';
import { normalizeUserMode } from '@/utils/userModeHelpers';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Auth state:', { user, isAuthenticated, isLoading, requiredRole });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIllustration />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - Not authenticated, redirecting to choose-mode');
    return <Navigate to="/choose-mode" replace state={{ from: location }} />;
  }

  // Si un rôle spécifique est requis, vérifier la correspondance
  if (requiredRole && user.role) {
    const normalizedUserRole = normalizeUserMode(user.role);
    const normalizedRequiredRole = normalizeUserMode(requiredRole);

    console.log('ProtectedRoute - Role check:', { 
      userRole: user.role, 
      normalizedUserRole, 
      requiredRole, 
      normalizedRequiredRole 
    });

    if (normalizedUserRole !== normalizedRequiredRole) {
      // Rediriger vers le dashboard approprié pour le rôle de l'utilisateur
      const userDashboardPath = normalizedUserRole === 'b2b_admin'
        ? '/b2b/admin/dashboard'
        : normalizedUserRole === 'b2b_user'
          ? '/b2b/user/dashboard'
          : '/b2c/dashboard';

      console.log('ProtectedRoute - Role mismatch, redirecting to:', userDashboardPath);
      return <Navigate to={userDashboardPath} replace />;
    }
  }

  console.log('ProtectedRoute - Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
