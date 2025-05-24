
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const ScanPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  if (!user || !userMode) {
    return <Navigate to="/choose-mode" replace />;
  }

  // Redirect to appropriate scan page based on user mode
  switch (userMode) {
    case 'b2c':
      return <Navigate to="/b2c/scan" replace />;
    case 'b2b_user':
      return <Navigate to="/b2b/user/scan" replace />;
    default:
      return <Navigate to="/choose-mode" replace />;
  }
};

export default ScanPage;
