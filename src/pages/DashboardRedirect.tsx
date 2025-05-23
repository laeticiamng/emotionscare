
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import LoadingAnimation from '@/components/ui/loading-animation';

const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: modeLoading } = useUserMode();

  useEffect(() => {
    if (authLoading || modeLoading) return;

    if (!isAuthenticated) {
      navigate('/choose-mode', { replace: true });
      return;
    }

    if (userMode) {
      const dashboardPath = getModeDashboardPath(userMode);
      navigate(dashboardPath, { replace: true });
    } else {
      navigate('/choose-mode', { replace: true });
    }
  }, [isAuthenticated, userMode, navigate, authLoading, modeLoading]);

  return (
    <div className="flex h-screen items-center justify-center">
      <LoadingAnimation text="Redirection vers votre tableau de bord..." />
    </div>
  );
};

export default DashboardRedirect;
