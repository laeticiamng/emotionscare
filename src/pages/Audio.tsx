
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeAudioPath } from '@/utils/userModeHelpers';

const Audio: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeAudioPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Audio;
