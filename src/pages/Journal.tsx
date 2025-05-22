
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeJournalPath } from '@/utils/userModeHelpers';

const Journal: React.FC = () => {
  const { userMode } = useUserMode();
  const redirectPath = getModeJournalPath(userMode);
  
  return <Navigate to={redirectPath} replace />;
};

export default Journal;
