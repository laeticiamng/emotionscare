
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeCoachPath } from '@/utils/userModeHelpers';

const Coach: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeCoachPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Coach;
