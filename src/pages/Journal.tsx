
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

const Journal: React.FC = () => {
  const { userMode } = useUserMode();
  
  if (userMode === 'b2c') {
    return <Navigate to="/b2c/journal" replace />;
  } else if (userMode === 'b2b_user') {
    return <Navigate to="/b2b/user/journal" replace />;
  } else if (userMode === 'b2b_admin') {
    return <Navigate to="/b2b/admin/dashboard" replace />; // Redirect admins to dashboard as they don't have journal
  }
  
  // Default fallback if no mode is selected
  return <Navigate to="/choose-mode" replace />;
};

export default Journal;
