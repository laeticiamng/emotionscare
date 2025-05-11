
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const ProtectedRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();
  const location = useLocation();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "userMode:", userMode, "isLoading:", isLoading);
  
  // Si l'authentification est en cours de chargement, afficher un indicateur de chargement
  if (isLoading || userModeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-2">Chargement en cours...</div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si l'utilisateur est authentifié mais n'a pas encore complété l'onboarding (si nécessaire)
  if (isAuthenticated && user && !user.onboarded && !location.pathname.includes('/onboarding')) {
    console.log("User needs to complete onboarding");
    return <Navigate to="/onboarding" replace />;
  }
  
  console.log("User authenticated, rendering protected content");
  // L'utilisateur est authentifié et a complété les étapes nécessaires, afficher le contenu protégé
  return <Outlet />;
};

export default ProtectedRoute;
