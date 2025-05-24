
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

const Coach: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  if (!user || !userMode) {
    return <Navigate to="/choose-mode" replace />;
  }

  // Redirect to appropriate coach page based on user mode
  switch (userMode) {
    case 'b2c':
      return <Navigate to="/b2c/coach" replace />;
    case 'b2b_user':
      return <Navigate to="/b2b/user/coach" replace />;
    default:
      return <Navigate to="/choose-mode" replace />;
  }
};

export default Coach;
