
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import B2BSelection from '@/pages/common/B2BSelection';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import { useUserMode } from '@/contexts/UserModeContext';

/**
 * This component wraps the common B2BSelection component 
 * to allow for specific auth-related routing and authentication checks
 */
const B2BSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  
  // Redirect already authenticated users to their dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      // If user is already logged in, redirect them to their dashboard
      const dashboardPath = getModeDashboardPath(userMode);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, navigate, user, userMode]);
  
  return <B2BSelection />;
};

export default B2BSelectionPage;
