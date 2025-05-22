
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './router';

const AppRouter: React.FC = () => {
  const element = useRoutes(routes);
  
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      {element}
    </Suspense>
  );
};

export default AppRouter;
