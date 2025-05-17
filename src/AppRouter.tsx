
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { routes } from './router';

const AppRouter: React.FC = () => {
  const content = useRoutes(routes);
  
  if (!content) {
    console.error("Aucune route ne correspond au chemin actuel");
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {content}
    </Suspense>
  );
};

export default AppRouter;
