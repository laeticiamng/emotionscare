
import React from 'react';
import { Navigate } from 'react-router-dom';
import { routes } from '@/routerV2';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const Music: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  if (!user || !userMode) {
    return <Navigate to={routes.special.chooseMode()} replace />;
  }

  // Redirect to appropriate music page based on user mode
  switch (userMode) {
    case 'b2c':
      return <Navigate to={routes.b2c.music()} replace />;
    case 'b2b_user':
      return <Navigate to={routes.b2b.user.music()} replace />;
    default:
      return <Navigate to={routes.special.chooseMode()} replace />;
  }
};

export default Music;
