
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

const AppRouter: React.FC = () => {
  const element = useRoutes(routes);
  
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingIllustration />
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
