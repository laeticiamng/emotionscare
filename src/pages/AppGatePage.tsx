/**
 * AppGatePage - Dispatcher intelligent selon le rôle utilisateur
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { Routes } from '@/routerV2/helpers';
import LoadingAnimation from '@/components/ui/loading-animation';

const AppGatePage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

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
    return <Navigate to={Routes.login()} replace />;
  }

  // Déterminer le rôle et rediriger vers le bon dashboard
  const role = user?.role || userMode;
  
  switch (role) {
    case 'b2c':
    case 'consumer':
      return <Navigate to={Routes.consumerHome()} replace />;
    
    case 'b2b_user':
    case 'employee':
      return <Navigate to={Routes.employeeHome()} replace />;
    
    case 'b2b_admin':
    case 'manager':
      return <Navigate to={Routes.managerHome()} replace />;
    
    default:
      // Par défaut, rediriger vers B2C
      console.warn(`[AppGatePage] Rôle inconnu: ${role}, redirection vers B2C`);
      return <Navigate to={Routes.consumerHome()} replace />;
  }
};

export default AppGatePage;