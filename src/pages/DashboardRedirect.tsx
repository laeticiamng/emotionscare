
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();

  useEffect(() => {
    if (userMode) {
      navigate(getModeDashboardPath(userMode));
    } else {
      navigate('/choose-mode');
    }
  }, [userMode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirection en cours...</h2>
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default DashboardRedirect;
