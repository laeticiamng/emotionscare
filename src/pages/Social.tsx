
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeSocialPath } from '@/utils/userModeHelpers';

const Social: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeSocialPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Social;
