
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const Dashboard: React.FC = () => {
  const { userMode } = useUserMode();
  const dashboardPath = getModeDashboardPath(userMode);
  
  return <Navigate to={dashboardPath} replace />;
};

export default Dashboard;
