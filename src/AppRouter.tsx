
import React, { Suspense } from 'react';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';
import { useDashboardMonitor } from './hooks/use-dashboard-monitor';
import { useAuth } from '@/contexts/AuthContext';
import usePreferredAccess from '@/hooks/use-preferred-access';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add monitoring for dashboard access issues
  useDashboardMonitor();
  // Apply unified access redirections
  usePreferredAccess();
  
  
  if (!content) {
    console.error("[AppRouter] No route matches the current path:", location.pathname);
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {content}
    </Suspense>
  );
};

export default AppRouter;
