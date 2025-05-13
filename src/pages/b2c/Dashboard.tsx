
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import DashboardContent from '@/components/dashboard/DashboardContent';

const B2CDashboard: React.FC = () => {
  const { setUserMode } = useUserMode();
  
  // Ensure the user mode is set correctly
  React.useEffect(() => {
    setUserMode('b2c');
  }, [setUserMode]);
  
  return <DashboardContent />;
};

export default B2CDashboard;
