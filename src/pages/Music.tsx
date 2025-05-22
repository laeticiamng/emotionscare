
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeMusicPath } from '@/utils/userModeHelpers';

const Music: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeMusicPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Music;
