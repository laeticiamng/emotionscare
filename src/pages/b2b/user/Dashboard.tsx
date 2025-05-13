
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import DashboardContent from '@/components/dashboard/DashboardContent';

const B2BUserDashboard: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // Ensure the user mode is set correctly
  React.useEffect(() => {
    setUserMode('b2b-user');
  }, [setUserMode]);
  
  return <DashboardContent />;
};

export default B2BUserDashboard;
