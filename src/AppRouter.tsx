
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';
import { useDashboardMonitor } from './hooks/use-dashboard-monitor';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  
  // Add monitoring for dashboard access issues
  useDashboardMonitor();
  
  if (!content) {
    console.error("No route matches the current path");
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {content}
    </Suspense>
  );
};

export default AppRouter;
