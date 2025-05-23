
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

interface AuthTransitionProps {
  children: React.ReactNode;
}

const AuthTransition: React.FC<AuthTransitionProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Définissez les chemins d'authentification qui devraient rediriger vers le dashboard si l'utilisateur est déjà connecté
    const authPaths = [
      '/login', '/register', '/b2c/login', '/b2c/register', 
      '/b2b/user/login', '/b2b/user/register', '/b2b/admin/login'
    ];
    
    // Si l'utilisateur est authentifié et se trouve sur une page d'authentification, rediriger vers le tableau de bord
    if (isAuthenticated && authPaths.includes(location.pathname)) {
      const dashboardPath = getModeDashboardPath(userMode);
      navigate(dashboardPath, { replace: true });
    }
    
    // Si l'utilisateur n'est pas authentifié et tente d'accéder à une page protégée
    // Note: Cette logique est gérée par ProtectedLayout, donc nous n'avons pas besoin de la dupliquer ici
  }, [isAuthenticated, navigate, location.pathname, user, userMode]);

  return <>{children}</>;
};

export default AuthTransition;
