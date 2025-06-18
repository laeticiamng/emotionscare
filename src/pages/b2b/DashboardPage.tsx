
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { Navigate } from 'react-router-dom';

const B2BDashboardPage: React.FC = () => {
  const { userMode } = useUserMode();

  // Rediriger vers le bon dashboard selon le rôle
  if (userMode === 'b2b_admin') {
    return <Navigate to="/b2b/admin/dashboard" replace />;
  } else if (userMode === 'b2b_user') {
    return <Navigate to="/b2b/user/dashboard" replace />;
  }

  // Par défaut, rediriger vers la sélection B2B
  return <Navigate to="/b2b/selection" replace />;
};

export default B2BDashboardPage;
