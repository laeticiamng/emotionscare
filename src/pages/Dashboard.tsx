
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { getModeDashboardPath } from '@/utils/userModeHelpers';
import Shell from '@/Shell';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/b2c/login');
      return;
    }

    if (userMode) {
      // Redirect to the appropriate dashboard based on user mode
      navigate(getModeDashboardPath(userMode));
    }
  }, [isAuthenticated, userMode, navigate]);

  return (
    <Shell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold mb-2">Chargement de votre tableau de bord...</h2>
            <p className="text-muted-foreground">Veuillez patienter un instant.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default Dashboard;
