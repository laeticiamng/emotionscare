
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: modeLoading } = useUserMode();

  // Show loading state while checking authentication
  if (authLoading || modeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingAnimation text="Vérification de l'authentification..." />
      </div>
    );
  }

  // Redirect to mode selection if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/choose-mode" replace />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedLayout;
