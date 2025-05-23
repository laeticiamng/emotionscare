
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from './ui/loading-animation';

interface ProtectedRouteWithModeProps {
  children: React.ReactNode;
  requiredMode: string;
  redirectTo?: string;
}

const ProtectedRouteWithMode: React.FC<ProtectedRouteWithModeProps> = ({ 
  children, 
  requiredMode,
  redirectTo = '/choose-mode'
}) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  
  // Afficher l'état de chargement pendant la vérification de l'authentification
  if (authLoading || userModeLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Vérification de l'accès..." />
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    switch (requiredMode) {
      case 'b2c':
        return <Navigate to="/b2c/login" replace />;
      case 'b2b_user':
        return <Navigate to="/b2b/user/login" replace />;
      case 'b2b_admin':
        return <Navigate to="/b2b/admin/login" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  // Rediriger vers la page de sélection de mode si le mode utilisateur ne correspond pas
  if (userMode !== requiredMode) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Autoriser l'accès à la route protégée
  return <>{children}</>;
};

export default ProtectedRouteWithMode;
