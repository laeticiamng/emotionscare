
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUserMode } from '@/contexts/UserModeContext';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { userMode, setUserMode } = useUserMode();

  // Pour la démo, tout le monde est considéré comme authentifié
  const demoIsAuthenticated = true;

  // Définir le mode utilisateur en fonction du chemin
  useEffect(() => {
    console.log('ProtectedRoute path:', location.pathname);
    if (location.pathname.includes('/admin')) {
      console.log('Setting mode to b2b-admin');
      setUserMode('b2b-admin');
      localStorage.setItem('userMode', 'b2b-admin');
    } else if (location.pathname.includes('/business')) {
      console.log('Setting mode to b2b-collaborator');
      setUserMode('b2b-collaborator');
      localStorage.setItem('userMode', 'b2b-collaborator');
    } else {
      console.log('Setting mode to b2c');
      setUserMode('b2c');
      localStorage.setItem('userMode', 'b2c');
    }
  }, [location.pathname, setUserMode]);

  // Débogage supplémentaire
  useEffect(() => {
    console.log('Current user mode in ProtectedRoute:', userMode);
  }, [userMode]);

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
