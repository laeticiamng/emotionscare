
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { userMode, isLoading: userModeLoading } = useUserMode();

  useEffect(() => {
    // Don't redirect until both auth and userMode are loaded
    if (authLoading || userModeLoading) {
      return;
    }

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      navigate('/login', { replace: true });
      return;
    }

    // Get the dashboard path based on user mode
    const dashboardPath = getModeDashboardPath(userMode);
    
    // If we're already on the right dashboard path, don't redirect
    if (location.pathname !== dashboardPath && location.pathname !== '/dashboard') {
      return;
    }
    
    // Redirect to the appropriate dashboard
    navigate(dashboardPath, { replace: true });
  }, [navigate, isAuthenticated, userMode, authLoading, userModeLoading]);

  // Render loading state
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-medium">Chargement de votre tableau de bord...</h2>
      </div>
    </div>
  );
};

export default Dashboard;
