
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from '@/routerV2';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useSimpleAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  if (authLoading || modeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification de l'authentification..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={routes.special.chooseMode()} replace />;
  }

  if (!userMode) {
    return <Navigate to={routes.special.chooseMode()} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
