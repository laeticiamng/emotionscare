
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeGamificationPath } from '@/utils/userModeHelpers';

const Gamification: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeGamificationPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Gamification;
