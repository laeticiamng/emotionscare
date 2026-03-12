import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
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

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Outlet />
    </>
  );
};

export default ProtectedLayout;