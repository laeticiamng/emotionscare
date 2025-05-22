
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { userMode, isLoading } = useUserMode();

  useEffect(() => {
    if (isLoading) return;
    
    const dashboardPath = getModeDashboardPath(userMode);
    console.log('Redirecting to dashboard:', dashboardPath);
    navigate(dashboardPath, { replace: true });
  }, [navigate, userMode, isLoading]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">Redirection vers votre tableau de bord...</h2>
      </div>
    </div>
  );
};

export default DashboardRedirect;
