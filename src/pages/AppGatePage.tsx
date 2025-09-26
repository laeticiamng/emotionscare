/**
 * AppGatePage - Dispatcher intelligent selon le rôle utilisateur
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import LoadingAnimation from '@/components/ui/loading-animation';
import { stripUtmParams } from '@/lib/utm';

const AppGatePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const cleanedSearch = stripUtmParams(location.search);
    if (cleanedSearch !== null) {
      navigate({ pathname: location.pathname, search: cleanedSearch, hash: location.hash }, { replace: true });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  // Debug pour comprendre le problème d'accès
  console.log('AppGatePage - État:', { isAuthenticated, user: user?.email, userMode, authLoading, modeLoading });

  // Chargement en cours
  if (authLoading || modeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingAnimation text="Redirection en cours..." />
      </div>
    );
  }

  // Pas authentifié -> Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Déterminer le rôle et rediriger vers le bon dashboard
  const role = user?.role || userMode;
  
  switch (role) {
    case 'b2c':
    case 'consumer':
      return <Navigate to="/app/home" replace />;
    
    case 'b2b_user':
    case 'employee':
      return <Navigate to="/app/collab" replace />;
    
    case 'b2b_admin':
    case 'manager':
      return <Navigate to="/app/rh" replace />;
    
    default:
      // Par défaut, rediriger vers B2C
      console.warn(`[AppGatePage] Rôle inconnu: ${role}, redirection vers B2C`);
      return <Navigate to="/app/home" replace />;
  }
};

export default AppGatePage;