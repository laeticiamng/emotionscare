
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import LoadingAnimation from '@/components/ui/loading-animation';

const AppRouter: React.FC = () => {
  const element = useRoutes(routes);
  
  // Render the routes with a loading fallback
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
