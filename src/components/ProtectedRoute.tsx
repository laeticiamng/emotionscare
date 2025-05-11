
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { setUserMode } = useUserMode();

  // Pour la démo, nous considérons tout le monde comme authentifié
  // Dans une vraie application, nous vérifierions isAuthenticated
  const demoIsAuthenticated = true;

  // Déterminer le mode d'utilisateur en fonction du chemin
  React.useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setUserMode('b2b-admin');
    } else if (location.pathname.includes('/business')) {
      setUserMode('b2b-collaborator');
    } else {
      setUserMode('b2c');
    }
  }, [location.pathname, setUserMode]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!demoIsAuthenticated) {
    toast({
      title: "Accès refusé",
      description: "Veuillez vous connecter pour accéder à cette page",
      variant: "destructive"
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
