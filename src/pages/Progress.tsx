
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeProgressPath } from '@/utils/userModeHelpers';

const Progress: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeProgressPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Progress;
