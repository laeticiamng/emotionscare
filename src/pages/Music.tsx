
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

const Music: React.FC = () => {
  const { userMode } = useUserMode();
  
  if (userMode === 'b2c') {
    return <Navigate to="/b2c/music" replace />;
  } else if (userMode === 'b2b_user') {
    return <Navigate to="/b2b/user/music" replace />;
  }
  
  // Default fallback if no mode is selected or if admin
  return <Navigate to="/choose-mode" replace />;
};

export default Music;
