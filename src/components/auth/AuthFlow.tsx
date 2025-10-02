import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import LoadingAnimation from '@/components/ui/loading-animation';

interface AuthFlowProps {
  children: React.ReactNode;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  if (authLoading || modeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement..." />
      </div>
    );
  }

  // Si l'utilisateur est connecté, rediriger vers son tableau de bord
  if (isAuthenticated && userMode) {
    const dashboardPath = getModeDashboardPath(userMode as any);
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default AuthFlow;
